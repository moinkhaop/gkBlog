// 统一的分页按钮序列生成工具，返回包含页码与是否省略号的信息
// 例如: [1, '...', 4,5,6, '...', 10]
export type PaginationToken = number | '...';

export interface BuildPaginationOptions {
    current: number; // 当前页 (1-based)
    total: number;   // 总页数
    sibling?: number; // 当前页左右展示的邻居数量，默认 1
}

export function buildPagination({ current, total, sibling = 1 }: BuildPaginationOptions): PaginationToken[] {
    if (total <= 0) return [];
    const tokens: PaginationToken[] = [];

    const clamp = (v: number) => Math.min(total, Math.max(1, v));
    const left = clamp(current - sibling);
    const right = clamp(current + sibling);

    const pushPage = (p: number) => {
        if (!tokens.includes(p)) tokens.push(p);
    };

    pushPage(1);
    pushPage(total);
    for (let p = left; p <= right; p += 1) pushPage(p);
    // 排序数字
    const pages = tokens.filter((t): t is number => typeof t === 'number').sort((a, b) => a - b);

    // 插入省略号
    const withEllipsis: PaginationToken[] = [];
    pages.forEach((p, idx) => {
        if (idx === 0) {
            withEllipsis.push(p);
            return;
        }
        const prev = pages[idx - 1];
        if (p - prev === 1) {
            withEllipsis.push(p);
        } else if (p - prev > 1) {
            withEllipsis.push('...');
            withEllipsis.push(p);
        }
    });
    return withEllipsis;
}
