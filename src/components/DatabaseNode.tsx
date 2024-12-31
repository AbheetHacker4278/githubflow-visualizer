import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface DatabaseNodeProps {
  data: {
    name: string;
    type: string;
    tables?: string[];
  };
}

const DatabaseNode = ({ data }: DatabaseNodeProps) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-200">
      <Handle type="target" position={Position.Top} className="w-16 !bg-gray-500" />
      <div className="flex items-center">
        <div className="rounded-full w-12 h-12 flex items-center justify-center bg-blue-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
            <path d="M3 6c0 1.1 2.2 2 5 2s5-.9 5-2-2.2-2-5-2-5 .9-5 2" />
            <path d="M3 6v14c0 1.1 2.2 2 5 2s5-.9 5-2V6" />
            <path d="M13 6c0 1.1 2.2 2 5 2s5-.9 5-2-2.2-2-5-2-5 .9-5 2" />
            <path d="M13 6v14c0 1.1 2.2 2 5 2s5-.9 5-2V6" />
          </svg>
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{data.name}</div>
          <div className="text-gray-500">{data.type}</div>
          {data.tables && (
            <div className="text-sm text-gray-400 mt-1">
              Tables: {data.tables.join(', ')}
            </div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-gray-500" />
    </div>
  );
};

export default DatabaseNode;