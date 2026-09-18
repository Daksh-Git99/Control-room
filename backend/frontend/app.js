const API_URL = "http://127.0.0.1:8000/api/run";

const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".section");

const pageTitles = {
    command: "Mission Control",
    execution: "Live Execution",
    results: "Mission Results",
    system: "System Architecture"
};


/* =========================
   NAVIGATION
========================= */

navItems.forEach(button => {

    button.addEventListener("click", () => {

        const target = button.dataset.section;

        navItems.forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        sections.forEach(section => {
            section.classList.remove("active-section");
        });

        document
            .getElementById(target)
            .classList.add("active-section");

        document.getElementById("pageTitle").textContent =
            pageTitles[target];
    });

});


/* =========================
   HELPERS
========================= */

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function getTime() {

    return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

}


function addLog(message, type = "info") {

    const log = document.getElementById("executionLog");

    const empty = log.querySelector(".log-empty");

    if (empty) {
        empty.remove();
    }

    const entry = document.createElement("div");

    entry.className = "log-entry";

    entry.innerHTML = `
        <span class="log-time">${getTime()}</span>
        <span class="log-${type}">${message}</span>
    `;

    log.appendChild(entry);

    log.scrollTop = log.scrollHeight;
}


/* =========================
   TOOL UI
========================= */

function resetTools() {

    document.querySelectorAll(".tool-card")
        .forEach(card => {

            card.classList.remove("active");
            card.classList.remove("recovered");

            const status =
                card.querySelector(".tool-status");

            if (status) {
                status.textContent =
                    card.id === "tool-recovery"
                    ? "READY"
                    : "IDLE";
            }

        });

}


function activateTool(tool, status = "ACTIVE") {

    const card =
        document.getElementById(`tool-${tool}`);

    if (!card) return;

    card.classList.add("active");

    const label =
        card.querySelector(".tool-status");

    if (label) {
        label.textContent = status;
    }

}


function recoverTool() {

    const card =
        document.getElementById("tool-recovery");

    card.classList.add("recovered");

    const label =
        card.querySelector(".tool-status");

    label.textContent = "SUCCESS";
}


/* =========================
   TASK RENDERING
========================= */

function renderTasks(plan) {

    const list =
        document.getElementById("taskList");

    list.innerHTML = "";

    document.getElementById("taskCount")
        .textContent = plan.length;

    plan.forEach((item, index) => {

        const task =
            typeof item === "string"
            ? item
            : item.task;

        const tool =
            typeof item === "string"
            ? "auto"
            : item.tool;

        const element =
            document.createElement("div");

        element.className = "task-item";

        element.innerHTML = `
            <div class="task-content">
                <span class="task-number">
                    ${String(index + 1).padStart(2, "0")}
                </span>

                ${task}

                <div>
                    <span class="task-tool">
                        ${tool.toUpperCase()}
                    </span>
                </div>
            </div>
        `;

        list.appendChild(element);

    });

}


/* =========================
   RESULTS
========================= */

function renderResults(data) {

    document.getElementById("resultGoal")
        .textContent = data.goal;

    const resultList =
        document.getElementById("resultList");

    resultList.innerHTML = "";

    data.results.forEach(result => {

        const element =
            document.createElement("div");

        element.className = "result-item";

        let resultText =
            typeof result.result === "string"
            ? result.result
            : JSON.stringify(result.result);

        if (resultText.length > 350) {
            resultText =
                resultText.substring(0, 350) + "...";
        }

        element.innerHTML = `
            <strong>
                Task ${result.task_number}
                · ${result.tool || "reasoning"}
            </strong>

            <small>${result.task}</small>

            <small>
                Status:
                ${result.status.toUpperCase()}
                ${result.recovered ? " · RECOVERED" : ""}
            </small>

            <small>${resultText}</small>
        `;

        resultList.appendChild(element);

    });


    const verificationList =
        document.getElementById("verificationList");

    verificationList.innerHTML = "";

    data.verification.forEach(item => {

        const element =
            document.createElement("div");

        element.className = "verify-item";

        element.innerHTML = `
            <div class="verify-icon">
                ${item.verified ? "✓" : "⚠"}
            </div>

            <span>
                ${item.task}
                <br>
                <small>${item.reason}</small>
            </span>
        `;

        verificationList.appendChild(element);

    });


    document.getElementById("finalText")
        .textContent =
        `The Control Room completed ${data.results.length} planned tasks, verified ${data.verification.filter(v => v.verified).length} results, and handled ${data.recovery.count || 0} recovery event(s).`;

}


/* =========================
   STATS
========================= */

function updateStats(data) {

    const taskCount =
        data.tool_plan.length;

    const tools =
        new Set(
            data.tool_plan
                .map(item => item.tool)
                .filter(tool => tool !== "none")
        ).size;

    const verified =
        data.verification
            .filter(item => item.verified)
            .length;

    const recoveries =
        data.recovery.count || 0;

    document.getElementById("statTasks")
        .textContent = taskCount;

    document.getElementById("statTools")
        .textContent = tools;

    document.getElementById("statVerified")
        .textContent = `${verified}/${data.verification.length}`;

    document.getElementById("statRecovery")
        .textContent = recoveries;
}


/* =========================
   EXECUTION PLAYBACK
========================= */

async function playExecution(data) {

    resetTools();

    const status =
        document.getElementById("executionStatus");

    status.textContent = "RUNNING";

    addLog("Mission accepted by Control Room.", "info");

    await delay(400);

    addLog(
        `AI Planner generated ${data.tool_plan.length} tasks.`,
        "info"
    );

    await delay(400);

    addLog(
        "Task plan passed to Executor.",
        "info"
    );

    for (let i = 0; i < data.tool_plan.length; i++) {

        const item =
            data.tool_plan[i];

        const result =
            data.results[i];

        await delay(450);

        const tool =
            item.tool;

        if (tool !== "none") {

            activateTool(tool, "ACTIVE");

            addLog(
                `Task ${i + 1}: ${tool.toUpperCase()} selected.`,
                "info"
            );

            await delay(350);
        }

        if (result && result.recovered) {

            activateTool("search", "FAILED");

            addLog(
                `⚠ Primary ${tool} failed.`,
                "warn"
            );

            await delay(400);

            addLog(
                "↻ Recovery engine activated.",
                "warn"
            );

            await delay(450);

            recoverTool();

            addLog(
                "✓ Alternative strategy selected.",
                "ok"
            );

            await delay(400);

        } else {

            if (tool !== "none") {

                const card =
                    document.getElementById(
                        `tool-${tool}`
                    );

                if (card) {

                    const label =
                        card.querySelector(
                            ".tool-status"
                        );

                    if (label) {
                        label.textContent =
                            tool === "verifier"
                            ? "VERIFIED"
                            : "COMPLETE";
                    }
                }
            }

            addLog(
                `✓ Task ${i + 1} completed.`,
                "ok"
            );
        }

    }

    await delay(500);

    addLog(
        "Verification pipeline completed.",
        "ok"
    );

    await delay(400);

    addLog(
        "Mission execution complete.",
        "ok"
    );

    status.textContent = "COMPLETE";
}


/* =========================
   RUN MISSION
========================= */

async function executeMission() {

    const goal =
        document.getElementById("goalInput")
            .value
            .trim();

    if (!goal) {

        alert("Enter a mission goal first.");

        return;
    }

    const button =
        document.getElementById("executeBtn");

    button.disabled = true;

    button.innerHTML =
        "EXECUTING <span>◌</span>";

    document.getElementById("executionLog")
        .innerHTML = "";

    resetTools();

    // Move to execution screen
    document
        .querySelector('[data-section="execution"]')
        .click();

    addLog(
        "Connecting to FastAPI Control Room...",
        "info"
    );

    try {

        const response =
            await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    goal: goal
                })

            });

        if (!response.ok) {
            throw new Error(
                `Backend returned ${response.status}`
            );
        }

        const data =
            await response.json();

        renderTasks(data.tool_plan);

        updateStats(data);

        renderResults(data);

        await playExecution(data);

        document
            .querySelector('[data-section="results"]')
            .click();

        document.getElementById("resultBadge")
            .textContent = "MISSION COMPLETE";

    }

    catch (error) {

        console.error(error);

        addLog(
            `✕ Backend connection failed: ${error.message}`,
            "warn"
        );

        document.getElementById("executionStatus")
            .textContent = "ERROR";

        alert(
            "Could not connect to the Control Room backend.\n\nMake sure FastAPI is running on port 8000."
        );

    }

    finally {

        button.disabled = false;

        button.innerHTML =
            "EXECUTE MISSION <span>→</span>";
    }
}


/* =========================
   BUTTON
========================= */

document
    .getElementById("executeBtn")
    .addEventListener(
        "click",
        executeMission
    );


/* =========================
   ENTER SHORTCUT
========================= */

document
    .getElementById("goalInput")
    .addEventListener("keydown", event => {

        if (
            event.key === "Enter" &&
            event.ctrlKey
        ) {
            executeMission();
        }

    });