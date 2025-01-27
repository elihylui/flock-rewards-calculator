export default function ValidatorCard({
  validatorLabel,
  validatorParams,
  setValidatorParams,
}: {
  validatorLabel: string;
  validatorParams: {
    stake: number;
    delegators: number;
    score: number;
    sigma: number;
  };
  setValidatorParams: (value: Partial<typeof validatorParams>) => void;
}) {
  return (
    <div className="bg-[#2E2E3F] border border-[#444B55] p-4 rounded-lg shadow-sm mb-4">
      <h3 className="text-base font-bold text-white mb-4">
        Validator {validatorLabel}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="block">
          <span className="text-sm font-medium text-[#A5A5A5]">
            Direct Stake (S<sub>v{validatorLabel}</sub>)
          </span>
          <input
            type="number"
            className="mt-2 w-full bg-[#1E1E2F] text-[#E0E0E0] border border-[#444B55] rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-[#42A5F5]"
            value={validatorParams.stake}
            onChange={(e) =>
              setValidatorParams({
                ...validatorParams,
                stake: parseFloat(e.target.value) || 0,
              })
            }
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[#A5A5A5]">
            Delegators' Stake (S<sub>d{validatorLabel}</sub>)
          </span>
          <input
            type="number"
            className="mt-2 w-full bg-[#1E1E2F] text-[#E0E0E0] border border-[#444B55] rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-[#42A5F5]"
            value={validatorParams.delegators}
            onChange={(e) =>
              setValidatorParams({
                ...validatorParams,
                delegators: parseFloat(e.target.value) || 0,
              })
            }
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[#A5A5A5]">
            Performance (F<sub>{validatorLabel}</sub>)
          </span>
          <input
            type="number"
            step="0.000001"
            className="mt-2 w-full bg-[#1E1E2F] text-[#E0E0E0] border border-[#444B55] rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-[#42A5F5]"
            value={validatorParams.score}
            onChange={(e) =>
              setValidatorParams({
                ...validatorParams,
                score: parseFloat(e.target.value) || 0,
              })
            }
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[#A5A5A5]">
            σ<sub>Val{validatorLabel}</sub> (Reward Ratio = 1 - σ)
          </span>
          <input
            type="number"
            step="0.1"
            className="mt-2 w-full bg-[#1E1E2F] text-[#E0E0E0] border border-[#444B55] rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-[#42A5F5]"
            value={validatorParams.sigma}
            onChange={(e) =>
              setValidatorParams({
                ...validatorParams,
                sigma: parseFloat(e.target.value) || 0,
              })
            }
          />
        </label>
      </div>
    </div>
  );
}
