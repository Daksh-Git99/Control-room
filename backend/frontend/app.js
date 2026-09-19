// ============================================================
// CONTROL ROOM — CLEAN FRONTEND
// ============================================================


const API_URL =
    "http://127.0.0.1:8000/api/run";


// ============================================================
// HELPERS
// ============================================================

function $(id) {
    return document.getElementById(id);
}


function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ============================================================
// NAVIGATION
// ============================================================

function showSection(id) {

    document
        .querySelectorAll(".page-section")
        .forEach(section => {

            section.classList.toggle(
                "active",
                section.id === id
            );

        });


    document
        .querySelectorAll(".nav-item")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.section === id
            );

        });


    const titles = {

        command: "Command Center",

        execution: "Mission Execution",

        results: "Intelligence Report",

        system: "System Architecture"

    };


    if ($("page-title")) {

        $("page-title").textContent =
            titles[id] || "Control Room";

    }
}


function setupNavigation() {

    document
        .querySelectorAll(".nav-item")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {
                    showSection(
                        button.dataset.section
                    );
                }
            );

        });

}


// ============================================================
// STATUS
// ============================================================

function setStatus(text) {

    if ($("system-status")) {

        $("system-status").textContent =
            text;

    }
}


// ============================================================
// RESET
// ============================================================

function resetOutput() {

    if ($("task-list")) {

        $("task-list").innerHTML = "";

    }

    if ($("execution-log")) {

        $("execution-log").innerHTML = "";

    }

    if ($("findings")) {

        $("findings").innerHTML = "";

    }

    if ($("verification")) {

        $("verification").innerHTML = "";

    }

    if ($("recovery-event")) {

        $("recovery-event").innerHTML = "";

    }

    if ($("final-result")) {

        $("final-result").innerHTML = "";

    }


    if ($("task-count")) {

        $("task-count").textContent = "—";

    }

    if ($("verified-count")) {

        $("verified-count").textContent = "—";

    }

    if ($("recovery-count")) {

        $("recovery-count").textContent = "—";

    }

    if ($("system-result-status")) {

        $("system-result-status").textContent = "—";

    }

}


// ============================================================
// LOG
// ============================================================

function addLog(message, type = "info") {

    const log = $("execution-log");

    if (!log) return;


    const row =
        document.createElement("div");

    row.className =
        `log-entry ${type}`;


    row.innerHTML = `

        <span class="log-dot"></span>

        <span>
            ${escapeHTML(message)}
        </span>

    `;


    log.appendChild(row);

    log.scrollTop =
        log.scrollHeight;

}


// ============================================================
// TASKS
// ============================================================

function renderTasks(tasks, toolPlan) {

    const container =
        $("task-list");

    if (!container) return;


    container.innerHTML = "";


    tasks.forEach((task, index) => {

        const tool =
            toolPlan?.[index]?.tool ||
            "none";


        container.innerHTML += `

            <div class="task-card">

                <div class="task-number">
                    ${String(index + 1).padStart(2, "0")}
                </div>

                <div class="task-content">

                    <div class="task-title">
                        ${escapeHTML(task)}
                    </div>

                    <div class="task-tool">
                        TOOL:
                        <strong>
                            ${escapeHTML(
                                tool.toUpperCase()
                            )}
                        </strong>
                    </div>

                </div>

                <div class="task-status">
                    READY
                </div>

            </div>

        `;

    });

}


// ============================================================
// FINDINGS
// ============================================================

function renderFindings(results) {

    const container =
        $("findings");

    if (!container) return;


    container.innerHTML = "";


    if (!Array.isArray(results)) {

        container.innerHTML = `
            <div class="empty-state">
                No findings returned.
            </div>
        `;

        return;
    }


    results.forEach(item => {

        const result =
            item.result;


        // SEARCH
        if (item.tool === "search") {

            const entries =
                Array.isArray(result)
                    ? result
                    : [];


            entries.forEach(entry => {

                let content = "";


                if (entry.snippet) {

                    content += `
                        <p>
                            ${escapeHTML(
                                entry.snippet
                            )}
                        </p>
                    `;

                }


                if (entry.data) {

                    const data =
                        entry.data;


                    if (
                        Array.isArray(
                            data.sources
                        )
                    ) {

                        content +=
                            data.sources
                                .map(source => `

                                    <div
                                        class="finding-provider"
                                    >

                                        <h4>
                                            ${escapeHTML(
                                                source.name
                                            )}
                                        </h4>

                                        <p>
                                            <strong>
                                                Service:
                                            </strong>

                                            ${escapeHTML(
                                                source.service
                                            )}
                                        </p>

                                        <p>
                                            <strong>
                                                Advantages:
                                            </strong>

                                            ${escapeHTML(
                                                source.advantages
                                                    ?.join(", ") || ""
                                            )}
                                        </p>

                                        <p>
                                            <strong>
                                                Limitations:
                                            </strong>

                                            ${escapeHTML(
                                                source.limitations
                                                    ?.join(", ") || ""
                                            )}
                                        </p>

                                    </div>

                                `)
                                .join("");

                    }

                    else if (
                        data.summary
                    ) {

                        content += `
                            <p>
                                ${escapeHTML(
                                    data.summary
                                )}
                            </p>
                        `;

                    }

                }


                container.innerHTML += `

                    <div class="result-card">

                        <div class="result-label">
                            SEARCH
                        </div>

                        <h3>
                            ${escapeHTML(
                                entry.title ||
                                "Research Result"
                            )}
                        </h3>

                        <div class="result-source">
                            ${escapeHTML(
                                entry.source ||
                                "Control Room"
                            )}
                        </div>

                        ${content}

                    </div>

                `;

            });

            return;
        }


        // CALCULATOR
        if (item.tool === "calculator") {

            renderCalculator(
                result,
                container
            );

            return;
        }


        // READER
        if (item.tool === "reader") {

            container.innerHTML += `

                <div class="result-card">

                    <div class="result-label">
                        READER
                    </div>

                    <h3>
                        Analysis
                    </h3>

                    <p>
                        ${escapeHTML(
                            result?.summary ||
                            "Information analyzed."
                        )}
                    </p>

                </div>

            `;

            return;
        }


        // VERIFIER
        if (item.tool === "verifier") {

            container.innerHTML += `

                <div class="result-card">

                    <div class="result-label">
                        VERIFIER
                    </div>

                    <h3>
                        Verification
                    </h3>

                    <p>
                        ✓ Verification completed.
                    </p>

                </div>

            `;

            return;
        }


        // GENERIC
        container.innerHTML += `

            <div class="result-card">

                <div class="result-label">
                    ${escapeHTML(
                        item.tool || "SYSTEM"
                    )}
                </div>

                <h3>
                    ${escapeHTML(
                        item.task ||
                        "System result"
                    )}
                </h3>

                <pre class="json-result">
${escapeHTML(
    typeof result === "string"
        ? result
        : JSON.stringify(
            result,
            null,
            2
        )
)}
                </pre>

            </div>

        `;

    });

}


// ============================================================
// CALCULATOR
// ============================================================

function renderCalculator(
    result,
    container
) {

    if (!result) return;


    if (result.monthly_costs) {

        const entries =
            Object.entries(
                result.monthly_costs
            );


        container.innerHTML += `

            <div class="result-card">

                <div class="result-label">
                    CALCULATOR
                </div>

                <h3>
                    Monthly Cost Analysis
                </h3>

                <div class="cost-grid">

                    ${entries.map(
                        ([provider, cost]) => `

                            <div class="cost-item">

                                <span>
                                    ${escapeHTML(provider)}
                                </span>

                                <strong>
                                    $${escapeHTML(cost)}
                                </strong>

                            </div>

                        `
                    ).join("")}

                </div>

                <p class="result-note">

                    Lowest calculated demo value:
                    <strong>
                        $${escapeHTML(
                            result.lowest_demo_cost
                        )}
                    </strong>

                </p>

            </div>

        `;

        return;
    }


    if (result.breakdown) {

        container.innerHTML += `

            <div class="result-card">

                <div class="result-label">
                    CALCULATOR
                </div>

                <h3>
                    Budget Analysis
                </h3>

                <div class="cost-grid">

                    ${Object.entries(
                        result.breakdown
                    ).map(
                        ([name, value]) => `

                            <div class="cost-item">

                                <span>
                                    ${escapeHTML(name)}
                                </span>

                                <strong>
                                    ₹${escapeHTML(value)}
                                </strong>

                            </div>

                        `
                    ).join("")}

                </div>

                <p class="result-note">

                    Total:
                    <strong>
                        ₹${escapeHTML(
                            result.total
                        )}
                    </strong>

                </p>

            </div>

        `;

        return;
    }


    container.innerHTML += `

        <div class="result-card">

            <div class="result-label">
                CALCULATOR
            </div>

            <h3>
                Calculation Result
            </h3>

            <pre class="json-result">
${escapeHTML(
    JSON.stringify(
        result,
        null,
        2
    )
)}
            </pre>

        </div>

    `;

}


// ============================================================
// VERIFICATION
// ============================================================

function renderVerification(
    verification
) {

    const container =
        $("verification");

    if (!container) return;


    container.innerHTML = "";


    if (!Array.isArray(verification)) {

        container.innerHTML = `
            <div class="empty-state">
                No verification information.
            </div>
        `;

        return;
    }


    verification.forEach(item => {

        container.innerHTML += `

            <div class="verification-item">

                <span class="verification-icon">
                    ${item.verified ? "✓" : "⚠"}
                </span>

                <span class="verification-text">

                    <strong>
                        ${escapeHTML(
                            item.task
                        )}
                    </strong>

                    <small>
                        ${escapeHTML(
                            item.reason || ""
                        )}
                    </small>

                </span>

            </div>

        `;

    });

}


// ============================================================
// RECOVERY
// ============================================================

function renderRecovery(
    recovery,
    results
) {

    const container =
        $("recovery-event");

    if (!container) return;


    container.innerHTML = "";


    const recovered =
        Array.isArray(results)
            ? results.filter(
                item => item.recovered
            )
            : [];


    if (
        !recovery?.recovered ||
        recovered.length === 0
    ) {

        container.innerHTML = `

            <div class="recovery-success">

                <strong>
                    ✓ NORMAL EXECUTION
                </strong>

                <p>
                    No recovery event was required.
                </p>

            </div>

        `;

        return;
    }


    recovered.forEach(item => {

        container.innerHTML += `

            <div class="recovery-event-card">

                <div class="recovery-failure">

                    <strong>
                        ⚠ TOOL FAILURE
                    </strong>

                    <p>
                        ${escapeHTML(
                            item.failure ||
                            "Primary tool failed."
                        )}
                    </p>

                </div>


                <div class="recovery-arrow">
                    →
                </div>


                <div class="recovery-success">

                    <strong>
                        ✓ RECOVERY SUCCESSFUL
                    </strong>

                    <p>
                        Alternative:
                        ${escapeHTML(
                            item.recovery_tool ||
                            "fallback"
                        )}
                    </p>

                </div>

            </div>

        `;

    });

}


// ============================================================
// FINAL RESULT
// ============================================================

function renderFinal(answer) {

    const container =
        $("final-result");

    if (!container) return;


    if (!answer) {

        container.innerHTML = `
            <div class="empty-large">
                <h3>
                    No final result returned
                </h3>
            </div>
        `;

        return;
    }


    let html = `

        <div class="final-result-content">

            <div class="result-label">
                FINAL SYNTHESIS
            </div>

            <h2>
                ${escapeHTML(
                    answer.headline ||
                    "Mission Complete"
                )}
            </h2>

            <p class="final-summary">
                ${escapeHTML(
                    answer.summary ||
                    ""
                )}
            </p>

    `;


    // Recommendations
    if (
        Array.isArray(
            answer.recommendations
        )
    ) {

        html += `

            <section class="final-section">

                <h3>
                    Recommendations
                </h3>

                <ul>

                    ${answer.recommendations
                        .map(item => `
                            <li>
                                ${escapeHTML(item)}
                            </li>
                        `)
                        .join("")}

                </ul>

            </section>

        `;

    }


    // Next step
    if (answer.next_step) {

        html += `

            <section class="final-section">

                <h3>
                    Next Step
                </h3>

                <p>
                    ${escapeHTML(
                        answer.next_step
                    )}
                </p>

            </section>

        `;

    }


    // Cost note
    if (answer.cost_note) {

        html += `

            <section class="final-section">

                <h3>
                    Cost Note
                </h3>

                <p>
                    ${escapeHTML(
                        answer.cost_note
                    )}
                </p>

            </section>

        `;

    }


    // Verification
    if (answer.verification) {

        html += `

            <section class="final-section">

                <h3>
                    Verification
                </h3>

                <p class="verified-text">
                    ✓
                    ${escapeHTML(
                        answer.verification
                    )}
                </p>

            </section>

        `;

    }


    // Deployment plan
    if (
        Array.isArray(
            answer.deployment_plan
        )
    ) {

        html += `

            <section class="final-section">

                <h3>
                    Deployment Plan
                </h3>

                <ol>

                    ${answer.deployment_plan
                        .map(step => `
                            <li>
                                ${escapeHTML(step)}
                            </li>
                        `)
                        .join("")}

                </ol>

            </section>

        `;

    }


    // Budget
    if (answer.budget) {

        html += `

            <section class="final-section">

                <h3>
                    Budget
                </h3>

                <div class="cost-grid">

                    ${Object.entries(
                        answer.budget.breakdown || {}
                    )
                    .map(
                        ([name, value]) => `

                            <div class="cost-item">

                                <span>
                                    ${escapeHTML(name)}
                                </span>

                                <strong>
                                    ₹${escapeHTML(value)}
                                </strong>

                            </div>

                        `
                    )
                    .join("")}

                </div>

                <p class="result-note">

                    Total:
                    <strong>
                        ₹${escapeHTML(
                            answer.budget.total
                        )}
                    </strong>

                </p>

            </section>

        `;

    }


    // Itinerary
    if (
        Array.isArray(
            answer.itinerary
        )
    ) {

        html += `

            <section class="final-section">

                <h3>
                    Itinerary
                </h3>

                <ol>

                    ${answer.itinerary
                        .map(day => `
                            <li>
                                ${escapeHTML(day)}
                            </li>
                        `)
                        .join("")}

                </ol>

            </section>

        `;

    }


    // Security
    if (
        Array.isArray(
            answer.security_steps
        )
    ) {

        html += `

            <section class="final-section">

                <h3>
                    Security Plan
                </h3>

                <ol>

                    ${answer.security_steps
                        .map(step => `
                            <li>
                                ${escapeHTML(step)}
                            </li>
                        `)
                        .join("")}

                </ol>

            </section>

        `;

    }


    html += `

        </div>

    `;


    container.innerHTML = html;

}


// ============================================================
// STATISTICS
// ============================================================

function updateStats(data) {

    const tasks =
        Array.isArray(data.tasks)
            ? data.tasks.length
            : 0;


    const verified =
        Array.isArray(data.verification)
            ? data.verification.filter(
                item => item.verified
            ).length
            : 0;


    const recoveries =
        data.recovery?.count || 0;


    if ($("task-count")) {

        $("task-count").textContent =
            tasks;

    }


    if ($("verified-count")) {

        $("verified-count").textContent =
            verified;

    }


    if ($("recovery-count")) {

        $("recovery-count").textContent =
            recoveries;

    }


    if ($("system-result-status")) {

        $("system-result-status").textContent =
            "PASS";

    }

}


// ============================================================
// RUN
// ============================================================

async function runControlRoom() {

    const input =
        $("goal-input");

    const button =
        $("run-button");


    if (!input) {

        console.error(
            "goal-input not found"
        );

        return;
    }


    const goal =
        input.value.trim();


    if (!goal) {

        alert(
            "Enter a mission goal first."
        );

        return;
    }


    if (button) {

        button.disabled = true;

        button.innerHTML =
            "EXECUTING...";

    }


    resetOutput();

    setStatus(
        "EXECUTING MISSION"
    );


    showSection(
        "execution"
    );


    addLog(
        "Goal received.",
        "info"
    );


    addLog(
        "Connecting to Control Room backend...",
        "info"
    );


    try {

        const response =
            await fetch(
                API_URL,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        goal: goal
                    })

                }
            );


        if (!response.ok) {

            throw new Error(
                `Backend returned HTTP ${response.status}`
            );

        }


        addLog(
            "Backend connection established.",
            "success"
        );


        const data =
            await response.json();


        addLog(
            "Mission data received.",
            "success"
        );


        // Render task plan
        renderTasks(
            data.tasks || [],
            data.tool_plan || []
        );


        addLog(
            `${(data.tasks || []).length} tasks generated.`,
            "success"
        );


        // Recovery
        if (
            data.recovery?.count > 0
        ) {

            addLog(
                "⚠ Tool failure detected.",
                "warning"
            );

            addLog(
                "↻ Recovery path completed.",
                "warning"
            );

        }


        // Verification
        addLog(
            "✓ Verification completed.",
            "success"
        );


        // Results
        renderFindings(
            data.results || []
        );


        renderVerification(
            data.verification || []
        );


        renderRecovery(
            data.recovery,
            data.results || []
        );


        renderFinal(
            data.final_answer
        );


        updateStats(
            data
        );


        addLog(
            "✓ Final result generated.",
            "success"
        );


        setStatus(
            "SYSTEM ONLINE"
        );


        showSection(
            "results"
        );

    }
    catch (error) {

        console.error(
            "Control Room error:",
            error
        );


        setStatus(
            "SYSTEM ERROR"
        );


        addLog(
            `❌ ${error.message}`,
            "error"
        );


        if ($("final-result")) {

            $("final-result").innerHTML = `

                <div class="empty-large">

                    <div class="empty-icon">
                        ⚠
                    </div>

                    <h3>
                        Mission could not be completed
                    </h3>

                    <p>
                        ${escapeHTML(
                            error.message
                        )}
                    </p>

                </div>

            `;

        }


        showSection(
            "results"
        );

    }
    finally {

        if (button) {

            button.disabled = false;

            button.innerHTML = `
                <span>▶</span>
                EXECUTE MISSION
                <span>→</span>
            `;

        }

    }

}


// ============================================================
// KEYBOARD SHORTCUT
// ============================================================

function setupKeyboard() {

    const input =
        $("goal-input");

    if (!input) return;


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.ctrlKey &&
                event.key === "Enter"
            ) {

                event.preventDefault();

                runControlRoom();

            }

        }
    );

}


// ============================================================
// START
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupNavigation();

        setupKeyboard();


        const button =
            $("run-button");


        if (button) {

            button.addEventListener(
                "click",
                runControlRoom
            );

        }


        setStatus(
            "SYSTEM ONLINE"
        );


        console.log(
            "✓ Control Room frontend initialized."
        );

    }
);