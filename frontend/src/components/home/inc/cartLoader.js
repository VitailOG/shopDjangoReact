import React from 'react';
import { ShimmerBadge, ShimmerTitle, ShimmerThumbnail } from "react-shimmer-effects";


export default function CartLoader() {
    return (
        <>
            <div className="col mb-5">
                <div className="card h-100">
                    <ShimmerThumbnail height={200} rounded />
                        <div className="card-body p-4">
                            <div className="text-center">
                                <ShimmerTitle line={2} gap={10} variant="primary" />
                            </div>
                        </div>
                    <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                        <div className="text-center">
                            <ShimmerBadge width={100} />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
};
