import React, { useState } from 'react';
import { Search, Download, FileSpreadsheet, FileText, ChevronLeft, ChevronRight, Filter, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ReportTable = ({ title, description, columns, data, searchPlaceholder = "Search...", searchableKeys = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(null); // 'csv', 'excel', 'pdf'

  // Filter Data
  const filteredData = data.filter(item => {
    if (!searchQuery) return true;
    return searchableKeys.some(key => {
      const val = item[key];
      return val && val.toString().toLowerCase().includes(searchQuery.toLowerCase());
    });
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      // Very basic CSV generation
      const headers = columns.map(c => c.header).join(',');
      const rows = filteredData.map(row => columns.map(c => `"${row[c.accessor] || ''}"`).join(','));
      const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${title.replace(/\s+/g, '_').toLowerCase()}_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
      setExportSuccess('csv');
      setTimeout(() => setExportSuccess(null), 3000);
    }, 800); // simulate loading
  };

  const handleMockExport = (type) => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(type);
      setTimeout(() => setExportSuccess(null), 3000);
    }, 1500); // simulate heavy rendering
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      
      {/* Toast Notification for Exports */}
      <AnimatePresence>
        {exportSuccess && (
          <motion.div initial={{ opacity: 0, y: -20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: -20, x: '-50%' }} className="fixed top-6 left-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-emerald-500/30 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5"/> {exportSuccess.toUpperCase()} Export Generated Successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{title}</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">{description}</p>
        </div>
        
        <div className="flex gap-2 relative">
          {isExporting && (
            <div className="absolute -top-10 right-0 flex items-center gap-2 text-sm font-bold text-slate-500 whitespace-nowrap">
               <span className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-hct-blue animate-spin"></span> Preparing Report...
            </div>
          )}
          <button onClick={() => handleMockExport('excel')} disabled={isExporting} className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 disabled:opacity-50 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors border border-emerald-200 text-sm">
            <FileSpreadsheet className="w-4 h-4"/> Excel
          </button>
          <button onClick={handleExportCSV} disabled={isExporting} className="bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors border border-slate-200 text-sm">
            <Download className="w-4 h-4"/> CSV
          </button>
          <button onClick={() => handleMockExport('pdf')} disabled={isExporting} className="bg-red-50 hover:bg-red-100 text-red-700 disabled:opacity-50 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors border border-red-200 text-sm">
            <FileText className="w-4 h-4"/> PDF
          </button>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-[24px]">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input type="text" value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} placeholder={searchPlaceholder} className="pl-9 p-2 rounded-lg border border-slate-300 w-80 text-sm outline-none focus:ring-2 focus:ring-hct-blue" />
            </div>

          </div>
          <div className="text-sm font-bold text-slate-500">
            Total Records: <span className="text-slate-800">{filteredData.length}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white border-b border-slate-200 text-slate-500">
              <tr>
                {columns.map((col, i) => (
                  <th key={i} className="p-4 font-bold uppercase tracking-wider">{col.header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-16 text-center">
                    <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold text-lg mb-1">No records found.</p>
                    <p className="text-slate-400 text-sm">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                    {columns.map((col, j) => (
                      <td key={j} className="p-4">
                        {col.render ? col.render(row) : <span className="font-medium text-slate-700">{row[col.accessor]}</span>}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filteredData.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-[24px] flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              Show 
              <select value={rowsPerPage} onChange={(e) => {setRowsPerPage(Number(e.target.value)); setCurrentPage(1);}} className="border border-slate-300 rounded p-1 font-bold outline-none">
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              records per page
            </div>
            
            <div className="flex items-center gap-4">
              <span className="font-medium text-slate-500">
                Showing {((currentPage - 1) * rowsPerPage) + 1} - {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-1 rounded-md border border-slate-300 text-slate-500 disabled:opacity-30 hover:bg-slate-200 transition-colors"><ChevronLeft className="w-5 h-5"/></button>
                <span className="w-8 text-center font-bold text-slate-700">{currentPage}</span>
                <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-1 rounded-md border border-slate-300 text-slate-500 disabled:opacity-30 hover:bg-slate-200 transition-colors"><ChevronRight className="w-5 h-5"/></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ReportTable;
