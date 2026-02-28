type Props = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
};

const StatCard = ({ title, value, icon }: Props) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-slate-100 p-2 text-slate-800">{icon}</div>
        <div className="min-w-0">
          <div className="text-sm text-slate-600">{title}</div>
          <div className="text-2xl font-semibold text-slate-900">{value}</div>
        </div>
      </div>
    </div>
  );
}

export default StatCard;