'use client';

import { useState, useEffect } from 'react';
import { Modal, Button, TimezoneInput } from '@/components/ui';
import { useSettings } from '@/contexts';

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { timezone, setTimezone } = useSettings();
  const [selectedTimezone, setSelectedTimezone] = useState(timezone);

  useEffect(() => {
    setSelectedTimezone(timezone);
  }, [timezone, isOpen]);

  const handleSave = () => {
    setTimezone(selectedTimezone);
    onClose();
  };

  const handleCancel = () => {
    setSelectedTimezone(timezone);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="Settings" size="md">
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Display Preferences</h4>
          <TimezoneInput
            label="Timezone"
            value={selectedTimezone}
            onChange={setSelectedTimezone}
            required
          />
          <p className="mt-2 text-xs text-gray-500">
            This timezone will be used for displaying all dates and times in the calendar.
          </p>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={handleCancel} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} className="flex-1">
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}
