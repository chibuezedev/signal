import React, { useState } from "react";

const Dashboard = () => {
  const [meetings, setMeetings] = useState([
    { id: 1, title: "Team Standup", time: "10:00 AM" },
    { id: 2, title: "Project Review", time: "2:00 PM" },
  ]);
  const [showNewMeetingForm, setShowNewMeetingForm] = useState(false);
  const [newMeetingTitle, setNewMeetingTitle] = useState("");
  const [newMeetingTime, setNewMeetingTime] = useState("");
  const [joinMeetingId, setJoinMeetingId] = useState("");
  const [inMeeting, setInMeeting] = useState(false);

  const handleCreateMeeting = (e) => {
    e.preventDefault();
    const newMeeting = {
      id: meetings.length + 1,
      title: newMeetingTitle,
      time: newMeetingTime,
    };
    setMeetings([...meetings, newMeeting]);
    setShowNewMeetingForm(false);
    setNewMeetingTitle("");
    setNewMeetingTime("");
  };

  const handleJoinMeeting = (e) => {
    e.preventDefault();
    // In a real application, you would validate the meeting ID here
    setInMeeting(true);
  };

  if (inMeeting) {
    return <VideoCall onEndCall={() => setInMeeting(false)} />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Upcoming Meetings
            </h3>
            <button
              onClick={() => setShowNewMeetingForm(true)}
              className="px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              New Meeting
            </button>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {meetings.map((meeting) => (
                <li key={meeting.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {meeting.title}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {meeting.time}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Join a Meeting
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <form
              onSubmit={handleJoinMeeting}
              className="space-y-4 sm:px-6 sm:py-5"
            >
              <div>
                <label
                  htmlFor="meetingId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Meeting ID
                </label>
                <input
                  type="text"
                  id="meetingId"
                  value={joinMeetingId}
                  onChange={(e) => setJoinMeetingId(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Join Meeting
              </button>
            </form>
          </div>
        </div>
      </div>
      {showNewMeetingForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Create New Meeting
            </h3>
            <form onSubmit={handleCreateMeeting} className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Meeting Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newMeetingTitle}
                  onChange={(e) => setNewMeetingTitle(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700"
                >
                  Meeting Time
                </label>
                <input
                  type="time"
                  id="time"
                  value={newMeetingTime}
                  onChange={(e) => setNewMeetingTime(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewMeetingForm(false)}
                  className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const VideoCall = ({ onEndCall }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 bg-gray-800 flex items-center justify-center">
        <div className="text-white text-2xl">Video Call Interface</div>
      </div>
      <div className="bg-gray-900 p-4 flex justify-center space-x-4">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-2 rounded-full ${
            isMuted ? "bg-red-500" : "bg-gray-700"
          }`}
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>
        <button
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={`p-2 rounded-full ${
            isVideoOff ? "bg-red-500" : "bg-gray-700"
          }`}
        >
          {isVideoOff ? "Turn Video On" : "Turn Video Off"}
        </button>
        <button onClick={onEndCall} className="p-2 rounded-full bg-red-500">
          End Call
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
