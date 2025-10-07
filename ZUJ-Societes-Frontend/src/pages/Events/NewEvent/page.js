import React from 'react';
import NewEventForm from './Components/NewEventForm';

export default function NewEvent() {
  return (
    <>
      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Event</h1>
            {/* <p className="text-lg text-gray-600">
              Organize an event for <span className="font-semibold text-blue-600">{societyName}</span>
            </p> */}
          </div>

          <NewEventForm />
        </div>
      </main>
    </>
  );
}
