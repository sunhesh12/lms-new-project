import styles from './css/table.module.css';

export default function Table({ columns, data, onRowClick, className = '' }) {
    const renderCell = (row, column) => {
        // Custom render function
        if (column.render) {
            return column.render(row);
        }
        
        // Handle nested properties
        if (column.accessor.includes('.')) {
            const keys = column.accessor.split('.');
            let value = row;
            
            for (const key of keys) {
                value = value?.[key];
                if (value === undefined) break;
            }
            
            return value ?? '-';
        }
        
        // Format based on type
        const value = row[column.accessor];
        
        if (value === null || value === undefined) {
            return '-';
        }
        
        // Boolean formatting
        if (typeof value === 'boolean') {
            return value ? 'Yes' : 'No';
        }
        
        // Array formatting
        if (Array.isArray(value)) {
            return value.join(', ');
        }
        
        // Object formatting (show count)
        if (typeof value === 'object') {
            return `[${Object.keys(value).length} items]`;
        }
        
        return value;
    };

    const handleRowClick = (row) => {
        if (onRowClick) {
            onRowClick(row);
        }
    };

    const getCellClassName = (column) => {
        const cellType = column.cellType || 'default';
        
        switch (cellType) {
            case 'checkbox':
                return styles.checkboxCell;
            case 'name':
                return styles.nameCell;
            case 'date':
                return styles.dateCell;
            case 'number':
                return styles.numberCell;
            case 'ctr':
                return styles.ctrCell;
            case 'status':
                return styles.statusCell;
            case 'actions':
                return styles.actionsCell;
            default:
                return '';
        }
    };

    return (
        <div className={`${styles.tableContainer} ${className}`}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th 
                                key={column.accessor}
                                className={column.sortable ? styles.sortable : ''}
                                style={{ 
                                    width: column.width,
                                    textAlign: column.align || 'left' 
                                }}
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td 
                                colSpan={columns.length} 
                                className={styles.emptyState}
                            >
                                No data available
                            </td>
                        </tr>
                    ) : (
                        data.map((row, index) => (
                            <tr 
                                key={row.id || index}
                                onClick={() => handleRowClick(row)}
                            >
                                {columns.map((column) => (
                                    <td 
                                        key={`${index}-${column.accessor}`}
                                        className={getCellClassName(column)}
                                        style={{ 
                                            textAlign: column.align || 'left',
                                            ...(column.cellStyle || {})
                                        }}
                                    >
                                        {renderCell(row, column)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}