import React, { useState } from 'react';
import { Timeline } from './components/Timeline';
import { MenuBar } from './components/MenuBar';
import { EventDialog } from './components/events/EventDialog';
import { sampleData } from './data/sampleData';
import { exportToJson, importFromJson } from './utils/fileUtils';
import { Event } from './types/timeline';

function App() {
  const [data, setData] = useState(sampleData);
  const [events, setEvents] = useState<Event[]>([]);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const importedData = await importFromJson(file);
          if (importedData.events) {
            setEvents(importedData.events);
          }
          if (importedData.data) {
            setData(importedData.data);
          }
        } catch (error) {
          console.error('Error importing file:', error);
          alert('Error importing file. Please make sure it\'s a valid JSON file.');
        }
      }
    };
    input.click();
  };

  const handleExport = () => {
    const exportData = {
      data,
      events,
      exportDate: new Date().toISOString()
    };
    exportToJson(exportData);
  };

  const handleAddEvent = (newEvent: Omit<Event, 'id'>) => {
    const event: Event = {
      ...newEvent,
      id: `event-${Date.now()}`
    };
    setEvents(prev => [...prev, event]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MenuBar 
        onImport={handleImport} 
        onExport={handleExport} 
        onAddEvent={() => setIsEventDialogOpen(true)}
      />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Timeline data={data} events={events} />
      </main>
      <EventDialog
        isOpen={isEventDialogOpen}
        onClose={() => setIsEventDialogOpen(false)}
        onSubmit={handleAddEvent}
      />
    </div>
  );
}

export default App;