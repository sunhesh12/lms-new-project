import styles from "@/css/components/enrollments.module.css";
import { faPlus, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Table from "@/components/Table";
import Button from "@/components/Button";

export default function Enrollments() {
    const handleEdit = (topic) => {
        // Edit logic
    };

    const handleDelete = (topic) => {
        // Delete logic
    };

    const columns = [
        {
            accessor: "checkbox",
            label: "",
            cellType: "checkbox",
            width: "48px",
            render: (row) => (
                <input
                    type="checkbox"
                    className={styles.checkbox}
                    onClick={(e) => e.stopPropagation()}
                />
            ),
        },
        {
            accessor: "topic_name",
            label: "Name",
            cellType: "name",
            sortable: true,
            width: "30%",
        },
        {
            accessor: "created_at",
            label: "Date",
            cellType: "date",
            render: (row) => new Date(row.created_at).toLocaleDateString(),
        },
        {
            accessor: "members_count",
            label: "Number of Members",
            cellType: "number",
            align: "right",
        },
        {
            accessor: "impressions",
            label: "Impressions",
            cellType: "number",
            align: "right",
        },
        {
            accessor: "ctr",
            label: "CTR",
            cellType: "ctr",
        },
        {
            accessor: "status",
            label: "Status",
            cellType: "status",
            render: (row) => {
                const statusClass =
                    {
                        pending: styles.statusPending,
                        active: styles.statusActive,
                        cancelled: styles.statusCancelled,
                        delay: styles.statusDelay,
                    }[row.status.toLowerCase()] || styles.statusActive;

                return (
                    <span className={`${styles.statusBadge} ${statusClass}`}>
                        {row.status}
                    </span>
                );
            },
        },
        {
            accessor: "actions",
            label: "Actions",
            cellType: "actions",
            render: (row) => (
                <>
                    <button
                        className={`${styles.actionButton} ${styles.downloadButton}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(row);
                        }}
                        title="Download"
                    >
                        ↓
                    </button>
                    <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(row);
                        }}
                        title="Delete"
                    >
                        🗑
                    </button>
                </>
            ),
        },
    ];

    const topics = [
        {
            id: "1a2b3c4d",
            topic_name: "SOP",
            created_at: "2024-03-25T18:45:00",
            members_count: 345,
            impressions: 23678,
            ctr: "40.5%",
            status: "Pending",
        },
        {
            id: "2b3c4d5e",
            topic_name: "Submissions Process_Module",
            created_at: "2024-03-25T12:30:00",
            members_count: 4464,
            impressions: 14236,
            ctr: "45.6%",
            status: "Active",
        },
        {
            id: "3c4d5e6f",
            topic_name: "Academic Documents",
            created_at: "2024-03-24T15:20:00",
            members_count: 1746,
            impressions: 8543,
            ctr: "33.7%",
            status: "Active",
        },
        {
            id: "4d5e6f7g",
            topic_name: "Compliance Audit Regs",
            created_at: "2024-03-23T10:55:00",
            members_count: 463,
            impressions: 53626,
            ctr: "34.1%",
            status: "Cancelled",
        },
        {
            id: "5e6f7g8h",
            topic_name: "Customer Support Tickets",
            created_at: "2024-03-23T04:30:00",
            members_count: 7346,
            impressions: 9768,
            ctr: "23.7%",
            status: "Cancelled",
        },
        {
            id: "6f7g8h9i",
            topic_name: "Inventory Supply Logistics",
            created_at: "2024-03-22T17:15:00",
            members_count: 3635,
            impressions: 16464,
            ctr: "37.2%",
            status: "Active",
        },
        {
            id: "7g8h9i0j",
            topic_name: "Project Team Tracking",
            created_at: "2024-03-22T11:40:00",
            members_count: 2745,
            impressions: 67457,
            ctr: "53.8%",
            status: "Active",
        },
        {
            id: "8h9i0j1k",
            topic_name: "Training Management Learning",
            created_at: "2024-03-21T14:05:00",
            members_count: 5532,
            impressions: 100345,
            ctr: "21.5%",
            status: "Active",
        },
        {
            id: "9i0j1k2l",
            topic_name: "Resource Task Allocation",
            created_at: "2024-03-21T09:20:00",
            members_count: 2643,
            impressions: 126986,
            ctr: "11.3%",
            status: "Delay",
        },
        {
            id: "0j1k2l3m",
            topic_name: "Data Analysis Reporting",
            created_at: "2024-03-21T09:15:00",
            members_count: 11024,
            impressions: 87093,
            ctr: "34.6%",
            status: "Delay",
        },
    ];

    return (
        <div className={styles.enrollments}>
            <header>
                <h2>
                    <span>
                        <FontAwesomeIcon icon={faUser} />
                    </span>{" "}
                    <span>Enrollments for the module</span>
                </h2>
            </header>
            <p>View, create or manually enroll students for the course.</p>
            <div id="table-toolbar" className={styles.tableToolbar}>
                <Button icon={faPlus} size="small">Add student</Button>
            </div>
            <Table
                columns={columns}
                data={topics}
                onRowClick={(topic) => console.log("Clicked:", topic)}
            />
        </div>
    );
}
