import EventForm from '../EventForm';
import { createEvent } from '../actions';

export default function NewEventPage() {
  return (
    <div className="max-w-xl rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <EventForm action={createEvent} />
    </div>
  );
}
