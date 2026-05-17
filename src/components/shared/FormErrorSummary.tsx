const FormErrorSummary = ({ messages }: { messages: string[] }) => {
  if (!messages.length) return null;

  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
      {messages.length === 1 ? (
        messages[0]
      ) : (
        <ul className="list-disc space-y-1 pl-5">
          {messages.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FormErrorSummary;
