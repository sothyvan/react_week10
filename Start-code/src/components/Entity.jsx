import React from "react";

function Entity({ health, entityName }) {
    const safeHealth = Math.max(0, Math.min(health, 100));

    return (
        <section className="container">
            <h2>{entityName}</h2>
            <div className="healthbar">
                <div
                style={{ width: `${safeHealth}%` }}
                className="healthbar__value"
                ></div>
            </div>
        </section>
    );
}

export default Entity;
