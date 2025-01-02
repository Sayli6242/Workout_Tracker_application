import React from 'react';

const Loader = () => (
    <div className="flex justify-center mt-8">
        <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
        </div>
    </div>
);

export default Loader;
