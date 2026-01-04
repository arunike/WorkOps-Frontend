export async function CancelTask(userID, taskPath) {
  try {
    const response = await fetch(`http://localhost:8081/tasks/${taskPath}`, {
      method: "DELETE",
    });
    if (response.ok) {
      window.location.reload();
    } else {
      console.error("Failed to delete task");
    }
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

export function DeleteToApprove(id, taskPath, cancel) {
}

export async function ActOnTask(task, requesterDetails, userID) {
  // Logic to update the actual data based on TaskName
  // task.TargetValue is the ID of the associate to update
  // task.Value is the new value
  // task.TaskName determines what to update

  try {
    // 1. Fetch current associate details
    const response = await fetch(`http://localhost:8081/associates/${task.TargetValue}`);
    if (!response.ok) throw new Error("Failed to fetch associate");
    const associate = await response.json();

    // 2. Modify based on task type
    if (task.TaskName === "Salary Increase") {
      associate.Salary = parseInt(task.Value);
    } else if (task.TaskName === "Title Change") {
      associate.Title = task.Value;
    }
    // Add other cases here if needed

    // 3. Save updated associate
    const updateResponse = await fetch(`http://localhost:8081/associates/${task.TargetValue}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(associate),
    });

    if (!updateResponse.ok) {
      console.error("Failed to update associate data");
    }

  } catch (error) {
    console.error("Error enacting task:", error);
  }
}

export async function ApproveTask(
  status,
  task,
  requesterDetails,
  userID,
  approverComments,
  approverID
) {
  // approverID seems redundant if userID is the approver, but matching signature
  const aid = approverID || userID;

  const updatedTask = { ...task };

  // Initialize approvers if missing (shouldn't happen given previous fixes, but safety)
  if (!updatedTask.approvers) updatedTask.approvers = {};

  // Update specific approver status
  // valid statuses: 'pending', 'approved', 'rejected'
  if (updatedTask.approvers[aid]) {
    updatedTask.approvers[aid] = {
      ...updatedTask.approvers[aid],
      status: status,
      timestamp: Math.floor(Date.now() / 1000), // Unix timestamp
      comments: approverComments || ""
    };
  } else {
    // If for some reason not in list but approving (e.g. admin override?), just add
    updatedTask.approvers[aid] = {
      status: status,
      timestamp: Math.floor(Date.now() / 1000),
      comments: approverComments || ""
    };
  }

  // Determine global status
  // Logic: If ANY rejection -> rejected. If ALL approved -> approved. Else pending.
  let globalStatus = "approved";
  let hasPending = false;

  for (const key in updatedTask.approvers) {
    const s = updatedTask.approvers[key].status;
    if (s === "rejected") {
      globalStatus = "rejected";
      break;
    }
    if (s === "pending") {
      hasPending = true;
    }
  }

  if (globalStatus === "approved" && hasPending) {
    globalStatus = "pending";
  }

  updatedTask.status = globalStatus;

  // Execute business logic if fully approved
  if (globalStatus === "approved") {
    await ActOnTask(updatedTask, requesterDetails, userID);
  }

  try {
    const response = await fetch(`http://localhost:8081/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });

    if (response.ok) {
      window.location.reload();
    } else {
      console.error("Failed to update task");
    }
  } catch (error) {
    console.error("Error updating task:", error);
  }
}
