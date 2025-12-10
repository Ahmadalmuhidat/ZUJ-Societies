import React from "react";
import AxiosClient from "../../../../config/axios";

export default function ChangeRole({
  selectedMember,
  newRole,
  setNewRole,
  society_id,
  getAllSocietyMembers,
  setShowModal
}) {

  const handleRoleUpdate = async () => {
    if (!selectedMember) {
      return;
    }

    try {
      const response = await AxiosClient.put("/societies/members/roles", {
        member: selectedMember.ID,
        role: newRole,
        society_id: society_id
      });

      if (response.status === 204) {
        getAllSocietyMembers();
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Change Role for {selectedMember?.Name}
        </h3>

        <select
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
        </select>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleRoleUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
