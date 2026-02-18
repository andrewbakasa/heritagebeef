'use client';
import React, { useState, useEffect, useCallback } from 'react';
import * as z from 'zod';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import ReactPaginate from 'react-paginate';


type PageSizeOption = '1' | '2' | '3' | '4' | '8' | '16' | '24' | '32' | '48' | '60';

export const RenderPaginationButtons: React.FC<{
    pageSize: number;
    handlePageSizeChange: (newPageSize: PageSizeOption) => void;
    handlePageClick: (event: { selected: number }) => void;
    pageCount: number;
    currentPage: number;
}> = ({ pageSize, handlePageSizeChange, handlePageClick, pageCount, currentPage }) => {
    const buttons = [];
    buttons.push(
        <ReactPaginate
            breakLabel="..."
            containerClassName="shadow-md border rounded-md pagination text-lg text-blue-500 justify-center mt-4 flex flex-row gap-2"
            activeClassName="active bg-amber-500 text-white"
            previousLabel="«"
            nextLabel="»"
            key={'andgwgw!'}
            onPageChange={handlePageClick}
            pageRangeDisplayed={50} // Reduced for better mobile view
            marginPagesDisplayed={1}          
            pageCount={pageCount}
            forcePage={currentPage}
            renderOnZeroPageCount={null}
        />
    );
    buttons.push(
        <Select
            value={pageSize.toString()}
            onValueChange={(value) => handlePageSizeChange(value as PageSizeOption)}
        >
            <SelectTrigger
                className="border-gray-700 rounded-md text-gray-300 bg-gray-800"
            >
                <SelectValue placeholder="Per Page" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="1" className="hover:bg-gray-700/50 text-white">1 per Page</SelectItem>
                <SelectItem value="2" className="hover:bg-gray-700/50 text-white">2 per Page</SelectItem>
                <SelectItem value="3" className="hover:bg-gray-700/50 text-white">3 per Page</SelectItem>
                <SelectItem value="4" className="hover:bg-gray-700/50 text-white">4 per Page</SelectItem>
                <SelectItem value="8" className="hover:bg-gray-700/50 text-white">8 per Page</SelectItem>
                <SelectItem value="16" className="hover:bg-gray-700/50 text-white">16 per Page</SelectItem>
                <SelectItem value="24" className="hover:bg-gray-700/50 text-white">24 per Page</SelectItem>
                <SelectItem value="32" className="hover:bg-gray-700/50 text-white">32 per Page</SelectItem>
                <SelectItem value="48" className="hover:bg-gray-700/50 text-white">48 per Page</SelectItem>
                <SelectItem value="60" className="hover:bg-gray-700/50 text-white">60 per Page</SelectItem>
            </SelectContent>
        </Select>
    );
    return <div className="flex justify-center gap-3 items-center">{buttons}</div>;
};