import React from 'react'
import { Badge } from "react-bootstrap";

export default function CustomBadge({ reminderCount }) {
    return (
        <>
            {
                reminderCount > 0 ?
                    <Badge className="badge bg-success">{reminderCount}</Badge>
                    :
                    ""
            }
        </>
    )
}
