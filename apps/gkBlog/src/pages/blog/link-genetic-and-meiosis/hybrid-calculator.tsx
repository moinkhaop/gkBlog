import { useState } from "react";

// 组件：遗传杂交计算器 (页面需要默认导出)
function HybridCalculator() {
  const [parent1, setParent1] = useState<string>("AA");
  const [parent2, setParent2] = useState<string>("aa");
  const [results, setResults] = useState<string[]>([]);

  // 使用数组组合而不是 for...of 避免 no-restricted-syntax 对迭代器的限制
  const calculateCross = () => {
    const parent1Alleles = parent1.split("");
    const parent2Alleles = parent2.split("");
    setResults(
      parent1Alleles.flatMap((a) => parent2Alleles.map((b) => `${a}${b}`))
    );
  };

  const getPhenotype = (genotype: string): string => {
    // 简单的显性/隐性判断
    if (genotype.includes("A")) {
      return "显性表型";
    }
    return "隐性表型";
  };

  const getResultSummary = () => {
    const phenotypes: { [key: string]: number } = {};
    results.forEach((genotype) => {
      const phenotype = getPhenotype(genotype);
      phenotypes[phenotype] = (phenotypes[phenotype] || 0) + 1;
    });
    return phenotypes;
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
        遗传杂交计算器
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* label 内嵌 input 并保留 htmlFor，兼容严格 a11y 规则 */}
          <label
            htmlFor="parent1"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            <span className="mb-2 block">亲本1基因型:</span>
            <input
              id="parent1"
              type="text"
              value={parent1}
              onChange={(e) => setParent1(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md 
                         bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="如: AA, Aa, aa"
            />
          </label>
          <label
            htmlFor="parent2"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            <span className="mb-2 block">亲本2基因型:</span>
            <input
              id="parent2"
              type="text"
              value={parent2}
              onChange={(e) => setParent2(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md 
                         bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="如: AA, Aa, aa"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={calculateCross}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md
                     transition-colors duration-200"
        >
          计算杂交结果
        </button>

        {results.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-3 text-slate-900 dark:text-slate-100">
              后代基因型:
            </h4>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {results.map((genotype) => (
                <div
                  key={genotype}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded text-center
                           text-slate-900 dark:text-slate-100 font-mono"
                >
                  {genotype}
                </div>
              ))}
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2 text-slate-900 dark:text-slate-100">
                表型比例:
              </h4>
              {Object.entries(getResultSummary()).map(([phenotype, count]) => (
                <div
                  key={phenotype}
                  className="text-slate-700 dark:text-slate-300"
                >
                  {phenotype}: {count} (
                  {((count / results.length) * 100).toFixed(1)}%)
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HybridCalculator;
