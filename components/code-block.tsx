"use client"
import { useTheme } from 'next-themes';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import dark from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus';
import light from 'react-syntax-highlighter/dist/esm/styles/prism/material-light';

export const CodeBlock = ({ code }:{ code:string }) => {
    const {theme} = useTheme()
    return (
        <div className="!px-6 !max-w-screen">
            <div className="h-full w-full flex justify-center items-center opacity-30">
                <div className="spot spot-yellow"></div>
                <div className="spot spot-red"></div>
            </div>
            <SyntaxHighlighter wrapLines language="jsx" style={theme === 'dark' ? dark : light} className="rounded-xl shadow-2xl dark:border dark:border-gray-600 codeblock">
                {code.trim()}
            </SyntaxHighlighter>
        </div>
    );
};