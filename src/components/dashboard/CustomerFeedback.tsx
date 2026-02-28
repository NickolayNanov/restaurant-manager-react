import { dashboardKpis, feedback } from "../../data/dashboard";

const Row = ({ label, value } : { label: string; value: number }) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-slate-600">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-slate-400" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

const CustomerFeedback = () => {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">Customer Feedback</h3>

      <div className="mt-3">
        <div className="text-3xl font-semibold text-slate-900">4.8</div>
        <div className="text-xs text-slate-600">{dashboardKpis.totalReviews.toLocaleString()} total reviews</div>
      </div>

      <div className="mt-4 space-y-3">
        <Row label="5★" value={feedback.fiveStar} />
        <Row label="4★" value={feedback.fourStar} />
        <Row label="3★" value={feedback.threeStar} />
        <Row label="2★" value={feedback.twoStar} />
        <Row label="1★" value={feedback.oneStar} />
      </div>
    </section>
  );
}

export default CustomerFeedback;