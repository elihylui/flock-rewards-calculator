export default function NodeCard({
  nodeLabel,
  nodeParams,
  setNodeParams,
}: {
  nodeLabel: string;
  nodeParams: {
    stake: number;
    delegators: number;
    score: number;
    sigma: number;
  };
  setNodeParams: (value: Partial<typeof nodeParams>) => void;
}) {
  return (
    <div className="bg-[#2E2E3F] border border-[#444B55] p-4 rounded-lg shadow-sm mb-4">
      <h3 className="text-base font-bold text-white mb-4">Node {nodeLabel}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="block">
          <span className="text-sm font-medium text-[#A5A5A5]">
            Direct Stake (t<sub>n{nodeLabel}</sub>)
          </span>
          <input
            type="number"
            className="mt-2 w-full bg-[#1E1E2F] text-[#E0E0E0] border border-[#444B55] rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-[#42A5F5]"
            value={nodeParams.stake}
            onChange={(e) =>
              setNodeParams({ ...nodeParams, stake: parseFloat(e.target.value) || 0 })
            }
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[#A5A5A5]">
            Delegators' Stake (t<sub>d{nodeLabel}</sub>)
          </span>
          <input
            type="number"
            className="mt-2 w-full bg-[#1E1E2F] text-[#E0E0E0] border border-[#444B55] rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-[#42A5F5]"
            value={nodeParams.delegators}
            onChange={(e) =>
              setNodeParams({
                ...nodeParams,
                delegators: parseFloat(e.target.value) || 0,
              })
            }
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[#A5A5A5]">
            Performance (g<sub>{nodeLabel}</sub>)
          </span>
          <input
            type="number"
            step="0.000001"
            className="mt-2 w-full bg-[#1E1E2F] text-[#E0E0E0] border border-[#444B55] rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-[#42A5F5]"
            value={nodeParams.score}
            onChange={(e) =>
              setNodeParams({
                ...nodeParams,
                score: parseFloat(e.target.value) || 0,
              })
            }
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[#A5A5A5]">
            σ<sub>{nodeLabel}</sub> (Reward Ratio = 1 - σ)
          </span>
          <input
            type="number"
            step="0.1"
            className="mt-2 w-full bg-[#1E1E2F] text-[#E0E0E0] border border-[#444B55] rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-[#42A5F5]"
            value={nodeParams.sigma}
            onChange={(e) =>
              setNodeParams({
                ...nodeParams,
                sigma: parseFloat(e.target.value) || 0,
              })
            }
          />
        </label>
      </div>
    </div>
  );
}
