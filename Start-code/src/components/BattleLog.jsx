import React from "react";

function BattleLog({ logs }) {
    // enteries is set to logs if it's provided, otherwise it is set to an empty array so the .map won't crash
    const entries = logs || [];

    return (
        //loops through each log object and print out each log as <li></li>
        <section id="log" className="container">
            <h2>Battle Log</h2>
            <ul>
                {entries.map((log) => {
                const actor = log.isPlayer ? "Player" : "Monster";
                const actorClass = log.isPlayer ? "log--player" : "log--monster";
                const actionClass = log.isDamage ? "log--damage" : "log--heal";

                return (
                    <li key={log.id}>
                    <span className={actorClass}>{actor}</span>
                    <span className={actionClass}>{log.text}</span>
                    </li>
                );
                })}
            </ul>
        </section>
    );
}

export default BattleLog;
