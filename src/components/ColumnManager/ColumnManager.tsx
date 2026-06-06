// import React, { useState } from 'react';
// import { ColumnConfig } from '../../types';
// import './ColumnManager.css';

// interface ColumnManagerProps {
//   columns: ColumnConfig[];
//   onUpdateColumns: (columns: ColumnConfig[]) => void;
// }

// export const ColumnManager: React.FC<ColumnManagerProps> = ({
//   columns,
//   onUpdateColumns,
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [tempColumns, setTempColumns] = useState(columns);

//   const handleToggleColumn = (columnId: string) => {
//     setTempColumns(prev =>
//       prev.map(col =>
//         col.id === columnId ? { ...col, visible: !col.visible } : col
//       )
//     );
//   };

//   const handleSave = () => {
//     onUpdateColumns(tempColumns);
//     setIsOpen(false);
//   };

//   const handleCancel = () => {
//     setTempColumns(columns);
//     setIsOpen(false);
//   };

//   return (
//     <div className="column-manager">
//       <button onClick={() => setIsOpen(!isOpen)} className="manage-columns-btn">
//         📊 Manage Columns
//       </button>
      
//       {isOpen && (
//         <div className="column-manager-modal">
//           <div className="column-manager-content">
//             <h3>Manage Columns</h3>
//             <div className="column-list">
//               {tempColumns.map(column => (
//                 <label key={column.id} className="column-item">
//                   <input
//                     type="checkbox"
//                     checked={column.visible}
//                     onChange={() => handleToggleColumn(column.id)}
//                   />
//                   {column.label}
//                 </label>
//               ))}
//             </div>
//             <div className="column-manager-actions">
//               <button onClick={handleSave} className="save-btn">Save</button>
//               <button onClick={handleCancel} className="cancel-btn">Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

import React, { useState, useRef, useEffect } from 'react';
import { ColumnConfig } from '../../types';
import './ColumnManager.css';

interface ColumnManagerProps {
  columns: ColumnConfig[];
  onUpdateColumns: (columns: ColumnConfig[]) => void;
}

export const ColumnManager: React.FC<ColumnManagerProps> = ({
  columns,
  onUpdateColumns,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempColumns, setTempColumns] = useState(columns);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleToggleColumn = (columnId: string) => {
    setTempColumns(prev =>
      prev.map(col =>
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const handleSave = () => {
    onUpdateColumns(tempColumns);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempColumns(columns);
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
    setTempColumns(columns);
  };

  return (
    <div className="column-manager">
      <button
        ref={buttonRef}
        onClick={handleOpen}
        className="manage-columns-btn"
      >
        📊 Manage Columns
      </button>
      
      {isOpen && (
        <div className="column-manager-modal" ref={modalRef}>
          <div className="column-manager-content">
            <h3>Manage Columns</h3>
            <div className="column-list">
              {tempColumns.map(column => (
                <label key={column.id} className="column-item">
                  <input
                    type="checkbox"
                    checked={column.visible}
                    onChange={() => handleToggleColumn(column.id)}
                  />
                  <span>{column.label}</span>
                </label>
              ))}
            </div>
            <div className="column-manager-actions">
              <button onClick={handleSave} className="save-btn">Save</button>
              <button onClick={handleCancel} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};