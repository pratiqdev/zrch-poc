"use client";

import { BaseRecord } from "./types";
import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  SetStateAction,
  FormEvent,
  useRef,
  useMemo,
  memo,
  JSXElementConstructor,
  Ref,
  MutableRefObject,
  RefObject,
  Fragment,
} from "react";
import { useUpdate } from "@/zrch/useUpdate";
import Fuse, { FuseOptionKey, FuseResult } from "fuse.js";
import createDebug from "debug";
import { BaseCtx, zrchCtx } from "./types";
import { getProbableKeys, getUniqueStrings, getUniqueTopLevelKeys } from "./zrchUtils";
import {
  Command,
  CommandInput,
  CommandDialog,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "@/zrch/ui/command";
import * as _ from 'lodash-es'
import { useIsSSR } from "@react-aria/ssr";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { ClassValue } from "class-variance-authority/types";
import { ClassNames } from "./types";


const log = createDebug("zrch");
createDebug.disable()
log("init...");





// log(`iconFuse:`, iconFuse.search('^activ'))
// TODO - remove unused context defaults like 
// TODO - add methods to update fuseConfig by key, or all at once with new config object (they should all be separate props)
const DEFAULT_CONTEXT: zrchCtx<any>= {
  searchable: [],
  recommended: [],
  autocomplete: [],
  searchValue: "",
  searchResults: [],
  isWindowOpen: false,
  groupBy: null,
  metaConfig: {
    attributionText: "By pratiqdev",
    recommendedLength: 5,
    resultsLength: 10,
    autoCompleteLength: 5,
  },
  fuseConfig: {
    includeScore: true,
    includeMatches: false,
    minMatchCharLength: 1,
    useExtendedSearch: true,
    ignoreFieldNorm: false,
    ignoreLocation: false,
    distance: 500,
    fieldNormWeight: 0.8,
    findAllMatches: true,
    threshold: .3,
    keys: [],
  },
};

const zrchCtx = createContext<BaseCtx<any>>({
  ctx: DEFAULT_CONTEXT,
  setCtx: () => {},
  mergeCtx: () => {},
});







//! ========================================================================================================================
export const useZrch = () => {
  const { ctx, setCtx, mergeCtx } = useContext(zrchCtx);

  const setValue = (value?: string) => {
    if (!value || typeof value !== "string") {
      mergeCtx({ searchValue: "" });
      return;
    }
    mergeCtx({ searchValue: value });
  };

  const toggleWindow = (open?: boolean) => {
    mergeCtx({ isWindowOpen: open !== undefined ? !!open : !ctx.isWindowOpen });
  };

  /** Sets a new searchable collection within fuse.js  */
  const setSearchable = (data: any[]) => {
    if (!Array.isArray(data)) {
      log(`The new searchable data must be an array!`);
      return;
    }
    mergeCtx({ searchable: data ?? [] });
  };

  const setGroupBy = (groupBy:string) => {
    if(typeof groupBy === 'string' && groupBy.length){
      mergeCtx({ groupBy })
    }
  }

  return {
    value: ctx.searchValue,
    results: ctx.searchResults,
    groupedResults: ctx.groupedResults,
    groupBy: ctx.groupBy,
    isWindowOpen: ctx.isWindowOpen,
    setGroupBy,
    setValue,
    toggleWindow,
    setSearchable,
    config: {
        ...ctx.metaConfig,
        ...ctx.fuseConfig
    }
  };
};

/*
TODO - consider removing recommendation array: the user can customize this with NoResultsComponent
TODO - find a way to use synonyms or multiple names for a key with fuse: i think this is supported with searchKeys={FuseOptionKey[] = [{ name: ['syn','onyms'] }] }
TODO - rethink state management approach: parse and set props in context.
TODO - consider using multiple providers and contexts for this: state updates are happening too frequently with no diff support

*/


//! ========================================================================================================================
export const zrchProvider = <T extends BaseRecord>({
  searchable = [],
  recommended = [],
  searchKeys = [],
  groupBy,
  children,
  //================================================
  useWindow = true,
  useAutocomplete = true,
  placeholder = 'Search...',
  portalInto = null,
  useDialog = true,
  onSelect = (result) => console.log('Selected item:', result),
  NoSearchComponent = () => {
    return <div>
        <p>Search for <b>anything</b></p>
      </div>
  },
  NoResultsComponent = () => {
    const { value } = useZrch()
    return <p>No results for <b className="tracking-wide">{value}</b></p>
  },
  FooterComponent = () => {
    return <p className="text-gray-500 p-2 text-xs">By /pratiqdev</p>
  },
  RenderItem = ({ result, index }) => {
    return <div>{JSON.stringify(result)}</div>
  },
  RenderList, 
  classNames = {}
}: { 
  
  
  
  //===========================================
  /** provider - array of strings, numbers or objects to search */
  searchable?: T[];
  recommended?: T[];
  searchKeys?: FuseOptionKey<T>[];
  groupBy?: string;
  children?: ReactNode;
  //=========
  /** window - text placeholder for the search input */
  useWindow?: boolean;
  useDialog?: boolean;
  useAutocomplete?: boolean;
  portalInto?: string | null;
  placeholder?: string;
  onSelect?: (result: FuseResult<T>) => void;
  NoSearchComponent?: () => ReactNode;
  NoResultsComponent?: () => ReactNode;
  FooterComponent?: () => ReactNode;
  RenderItem?:  ({ result, index }:{ result: FuseResult<T>, index: number }) => ReactNode;
  RenderList?:  ({ results, value, onSelect }:{ results: FuseResult<T>[],  groupedResults: [string, FuseResult<T>[]][], value: string, onSelect: (value:any) => void }) => ReactNode;
  classNames?: ClassNames;
}) => {







   //===========================================
  const [ctx, setCtx] = useState<zrchCtx<T>>({
    ...DEFAULT_CONTEXT,
    groupBy: groupBy ?? null,
    searchable,
    recommended,
    searchKeys,
  });
  const fuseRef = useRef<null | Fuse<T>>(null);
  // const keyFuseRef = useRef<null | Fuse<string>>(null);
  const autocompleteFuseRef = useRef<null | Fuse<string>>(null);
  const isSsr = useIsSSR()
  const Wrapper = useDialog ? CommandDialog : Command
  

  /** Merge new state with existing state
   *
   * causes global rerender as object ref change causes react state update */
  const mergeCtx = (
    newCtx: Partial<zrchCtx<T>> | SetStateAction<Partial<zrchCtx<T>>>
  ) => { 
    try {
      log(`Merging new ctx:`, newCtx);
      setCtx((x) =>
        typeof newCtx === "function"
          ? (newCtx(x) as zrchCtx<T>)
          : { ...x, ...newCtx }
      );
    } catch (err) {
      log("Context merge error:", err);
    }
  };

  const GroupedResults = () => (
      <>
        {ctx.groupedResults?.map(([section, data]:[string, FuseResult<T>[]], index:number) => (
          <React.Fragment key={index}>
          <CommandGroup key={section} heading={section} hidden={!data.length}>
              {data.map((d, idx) => (
                  RenderItem && 
                    <CommandItem key={idx} onSelect={() => onSelect(d)}>
                      <RenderItem key={idx} result={d} index={idx} /> 
                    </CommandItem>
                  // : <DefaultItem key={idx} type={section} item={d.item} />
              ))}
          </CommandGroup>
          <CommandSeparator />
          </React.Fragment>
      ))}
      </>
  )
  const Results = () => (
      <>
        {ctx.searchResults?.map((d, idx) => 
          RenderItem &&
          <CommandItem key={idx} onSelect={() => onSelect(d)}>
            <RenderItem key={idx} result={d} index={idx} />
          </CommandItem>
              // : <DefaultItem key={JSON.stringify({idx, item: d.item})} type={d.item.type} item={d.item} /> 
        )}
      </>
  )


  // perform search
  useUpdate(() => {
    let res = !ctx.searchValue 
      ? []
      : fuseRef.current?.search(ctx?.searchValue ?? "")
      .filter((x, idx) => idx < ctx.metaConfig.resultsLength) ?? []

    let groupedRes = groupBy 
      ? Object.entries(_.groupBy(res, i => i?.item?.[groupBy]  )) 
      : []
    let autocomplete = !useAutocomplete 
      ? [] 
      : autocompleteFuseRef.current?.search(ctx?.searchValue.includes(' ') ? ctx.searchValue.split(' ').pop() ?? '' : ctx.searchValue ?? '')
        .filter((x, idx) => x.item !== ctx.searchValue && !ctx.searchValue.includes(x.item) && idx < ctx.metaConfig.autoCompleteLength)
        .map(x => x.item) ?? []
            
    mergeCtx({ 
        searchResults: res,
        groupedResults: groupedRes as typeof groupedRes,
        autocomplete,
        groupBy
    });
  }, [ctx.searchValue, groupBy]);

  //  initialize fuse.js with config and searchable data (this effect is for updating the fust instance and config data)
  useUpdate(() => {
    log(`Searchable data or config updated:`, ctx.searchable, ctx.config);

    // check if there is keys config
    log(`Checking for fuse keys...`);
    let fuseKeys = searchKeys ?? ctx?.fuseConfig?.keys ?? [];
    if (fuseKeys.length === 0) {
      log(`No fuse keys provided - parsing data for probable keys`);
      fuseKeys = getProbableKeys(searchable)
      log(`Found probable keys:`, fuseKeys)
    } else {
      log(`Custom fuse keys provided:`, fuseKeys);
    }

    let probKeys = getProbableKeys(searchable) as any
    log(`updating prob keys:`, probKeys)

    let uniqueStrings = getUniqueStrings(searchable) as any
    log(`updating prob keys:`, probKeys)
    

    mergeCtx({ 
      groupBy: groupBy,
      fuseConfig: { ...ctx.fuseConfig, keys: fuseKeys }
     });

    // keyFuseRef.current = new Fuse(probKeys, {
    //     includeScore: true,
    //     isCaseSensitive: false,
    //     findAllMatches: true,
    //     threshold: .5
    // })
    
    autocompleteFuseRef.current = new Fuse(uniqueStrings, {
      includeScore: true,
      isCaseSensitive: false,
      findAllMatches: true,
      threshold: .5
    })

    // create fuse instance
    fuseRef.current = new Fuse(ctx.searchable, {
      includeScore: ctx.fuseConfig.includeScore,
      includeMatches: ctx.fuseConfig.includeMatches,
      useExtendedSearch: ctx.fuseConfig.useExtendedSearch,
      minMatchCharLength: ctx.fuseConfig.minMatchCharLength,
      ignoreFieldNorm: ctx.fuseConfig.ignoreFieldNorm,
      ignoreLocation: ctx.fuseConfig.ignoreLocation,
      distance: ctx.fuseConfig.distance,
      // increase the importance of shorter text samples
      fieldNormWeight: ctx.fuseConfig.fieldNormWeight,
      findAllMatches: ctx.fuseConfig.findAllMatches,
      threshold: ctx.fuseConfig.threshold,
      keys: fuseKeys,
    });
    log(`Created fuse instance:`, fuseRef.current);
  }, [ctx.searchable, ctx.config]);

  // get the searchable data from props (this useEffect is for handling props from this component)
  useEffect(() => {
    // docRef.current = window?.document
    if (!Array.isArray(searchable)) {
        log(`The data provided to zrch must be an array. Received:`, searchable)
        return
    }
    mergeCtx({ searchable: searchable });
  }, [searchable, groupBy]);

  
 


  



  return (
    <zrchCtx.Provider value={{ ctx, setCtx, mergeCtx }} >

      {children}

      {!isSsr && useWindow
        ? createPortal(
            <Wrapper
              className={cn("", classNames.wrapper)}
              open={isSsr ? false : ctx.isWindowOpen}
              onOpenChange={b => mergeCtx({ isWindowOpen: b })}
              shouldFilter={false}
          >
          <CommandInput
              className={cn("", classNames.input)}
              placeholder={placeholder}
              value={ctx.searchValue}
              onValueChange={v => mergeCtx({ searchValue: v })}
          />
          {/* {useAutocomplete && <div id="zrch-autocomplete" className={cn("h-0 translate-y-[-1rem] flex gap-2 text-[12px] px-2 pl-[2.35rem] text-gray-500 font-light", classNames.autocomplete)}>
            {ctx?.autocomplete.map((com, idx) => <span key={com + idx}>{com}</span>)}
          </div>} */}
          <CommandList className={cn("h-full flex flex-col items-stretch", useDialog && "min-h-[80vh] sm:min-h-[20rem]", classNames.list)}>
              
              {useAutocomplete && 
              <CommandItem disabled id="zrch-autocomplete" className={cn("py-0 flex gap-2 text-[12px] text-gray-500 font-light", classNames.autocomplete)}>
                {ctx?.autocomplete.map((com, idx) => <span key={com + idx}>{com}</span>)}
              </CommandItem>
              }

            {(ctx.searchValue.length >= ctx.fuseConfig.minMatchCharLength && ctx.searchResults.length === 0) && 
              <CommandItem className={cn("min-h-[8rem] flex items-center justify-center" , classNames.item)} disabled>
                <NoResultsComponent  />
              </CommandItem>
            }
            {(ctx.searchValue.length < ctx.fuseConfig.minMatchCharLength && ctx.searchResults.length === 0) && 
              <CommandItem  className={cn("min-h-[8rem] flex items-center justify-center" , classNames.item)} disabled>
                <NoSearchComponent /> 
              </CommandItem>
            }

            {RenderList ? <RenderList results={ctx.searchResults} groupedResults={ctx.groupedResults} value={ctx.searchValue} onSelect={onSelect} /> : groupBy ? <GroupedResults /> : <Results />}
            {recommended?.length > 0 && 
              <CommandGroup heading='Recommended' 
              // className={cn("", classNames.group)}
              >
                {recommended.map((rec, idx) => 
                 RenderItem &&
                  <CommandItem key={idx} onSelect={() => onSelect({ item: rec, refIndex: 0 })} className={cn("", classNames.item)}>
                    <RenderItem result={{ item: rec, refIndex: 0 }} index={idx} />
                  </CommandItem>
                )}
              </CommandGroup>
            }
            </CommandList>
            {FooterComponent && <FooterComponent />}
          </Wrapper>,
              ((document || window?.document) && typeof portalInto === 'string')
                ? (document || window?.document)?.getElementById(portalInto) 
                  ?? (document || window?.document)?.querySelector(portalInto) 
                  ?? (document || window?.document)?.body
                : (document || window?.document)?.body
          , 'Wrapper'
        )
      : null
      }



    </zrchCtx.Provider>
  );
};



export default zrchProvider