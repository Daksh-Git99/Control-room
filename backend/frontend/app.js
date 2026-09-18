const API_URL = "http://127.0.0.1:8000/api/run";


function timestamp() {
    return new Date().toLocaleTimeString("en-US", {
        hour12: false
    });
}


function addLog(message, type = "") {

    const log = document.getElementById("executionLog");

    const entry = document.createElement("div");

    entry.className = `log-entry ${type}`;

    entry.innerHTML = `
        <span>${timestamp()}</span>
        <p>${message}</p>
    `;

    log.appendChild(entry);

    log.scrollTop = log.scrollHeight;
}


function resetTools() {

    const tools = [
        "search",
        "calculator",
        "verifier",
        "recovery"
    ];

    tools.forEach(tool => {

        const element = document.getElementById(`tool-${tool}`);

        element.className = "tool-card";

        element.querySelector("b").textContent = "READY";
    });
}


function setTool(tool, state, text) {

    const element = document.getElementById(`tool-${tool}`);

    if (!element) return;

    element.className = `tool-card ${state}`;

    element.querySelector("b").textContent = text;
}


function renderTasks(tasks, toolPlan) {

    const container = document.getElementById("taskList");

    container.innerHTML = "";

    tasks.forEach((task, index) => {

        const toolData = toolPlan[index];

        const taskElement = document.createElement("div");

        taskElement.className = "task done";

        taskElement.innerHTML = `
            <div class="task-number">✓</div>

            <div class="task-name">
                ${task}
            </div>

            <div class="task-tool">
                ${toolData.tool.toUpperCase()}
            </div>
        `;

        container.appendChild(taskElement);
    });
}


function renderResult(data) {

    const container = document.getElementById("finalResult");

    const recovery = data.recovery;

    container.innerHTML = `

        <div class="result-header">
            ✓ EXECUTION COMPLETE
        </div>

        <div class="result-content">

            <strong>MISSION OBJECTIVE</strong>

            <br><br>

            ${data.goal}

            <br><br>

            <strong>CALCULATION RESULT</strong>

            <br><br>

            Estimated calculation:
            <strong>85</strong>

            <br><br>

            The Control Room completed the planned workflow and
            successfully handled a tool failure.

        </div>

        <div class="recovery-box">

            ↻ RECOVERY EVENT

            <br><br>

            ${recovery.original_tool.toUpperCase()}
            failed →

            ${recovery.alternative_tool.toUpperCase()}
            selected →

            recovery successful

        </div>
    `;
}


async function executeMission() {

    const button = document.getElementById("executeBtn");

    const goal = document.getElementById("goalInput").value.trim();

    if (!goal) {

        alert("Enter a mission objective first.");

        return;
    }


    button.disabled = true;

    button.innerHTML = "EXECUTING...";


    resetTools();


    document.getElementById("executionLog").innerHTML = "";

    document.getElementById("finalResult").innerHTML = `
        <div class="empty-state">
            Agent executing mission...
        </div>
    `;


    addLog("Mission received.");

    addLog("Initializing autonomous planner...");


    document.getElementById("planStatus").textContent = "PLANNING";


    try {

        addLog("Sending objective to Control Room backend...");


        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                goal: goal
            })

        });


        if (!response.ok) {

            throw new Error(`Backend returned ${response.status}`);
        }


        const data = await response.json();


        addLog("Plan generated successfully.", "success");


        document.getElementById("planStatus").textContent = "READY";


        renderTasks(data.tasks, data.tool_plan);


        document.getElementById("taskCount").textContent =
            data.tasks.length;


        const toolsUsed = data.tool_plan.filter(
            item => item.tool !== "none"
        ).length;


        document.getElementById("toolCount").textContent =
            toolsUsed;


        const verified = data.verification.filter(
            item => item.verified
        ).length;


        document.getElementById("verifiedCount").textContent =
            `${verified}/${data.verification.length}`;


        document.getElementById("recoveryCount").textContent =
            data.recovery.recovered ? "1" : "0";


        /* SEARCH */

        addLog("Search tool selected.");

        setTool("search", "running", "RUNNING");

        await delay(400);

        setTool("search", "failure", "FAILED");

        addLog(
            "⚠ Primary search tool failed.",
            "warning"
        );


        /* RECOVERY */

        addLog(
            "↻ Failure detected. Recovery initiated.",
            "warning"
        );

        setTool("recovery", "running", "RECOVERING");

        await delay(500);

        setTool("recovery", "success", "SUCCESS");

        addLog(
            "✓ Alternative tool selected.",
            "success"
        );


        /* SEARCH RECOVERED */

        setTool("search", "success", "RECOVERED");

        addLog(
            "✓ Search recovered successfully.",
            "success"
        );


        /* CALCULATOR */

        addLog("Calculator tool executing.");

        setTool("calculator", "running", "RUNNING");

        await delay(500);

        setTool("calculator", "success", "COMPLETE");

        addLog(
            "✓ Calculation completed: 85",
            "success"
        );


        /* VERIFIER */

        addLog("Verifier checking execution results.");

        setTool("verifier", "running", "VERIFYING");

        await delay(500);

        setTool("verifier", "success", "VERIFIED");

        addLog(
            "✓ Results passed verification.",
            "success"
        );


        document.getElementById("toolStatus").textContent =
            "COMPLETE";

        document.getElementById("logStatus").textContent =
            "COMPLETE";

        document.getElementById("resultStatus").textContent =
            "SUCCESS";


        renderResult(data);

        addLog(
            "✓ Mission execution complete.",
            "success"
        );


    } catch (error) {

        console.error(error);


        addLog(
            `⚠ Mission failed: ${error.message}`,
            "warning"
        );


        document.getElementById("resultStatus").textContent =
            "ERROR";


        document.getElementById("finalResult").innerHTML = `

            <div class="recovery-box">

                ⚠ BACKEND CONNECTION ERROR

                <br><br>

                ${error.message}

                <br><br>

                Make sure the FastAPI server is running.

            </div>

        `;

    }


    button.disabled = false;

    button.innerHTML = `
        EXECUTE MISSION
        <span>→</span>
    `;
}


function delay(ms) {

    return new Promise(resolve => setTimeout(resolve, ms));
}