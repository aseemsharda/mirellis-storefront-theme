export type ExportablePrivateRecord<TRecord> = {
  day: number;
  completedDays: number[];
  records: TRecord[];
};

export function buildPrivateRecordExport<TRecord>(data: ExportablePrivateRecord<TRecord>, exportedAt = new Date()) {
  return {
    product: 'Mirellis After Work',
    exportedAt: exportedAt.toISOString(),
    privacy: 'This export contains only choices and actions explicitly confirmed in this browser.',
    programme: {
      currentDay: Math.min(data.day, 21),
      completedDays: [...data.completedDays],
      records: [...data.records],
    },
  } as const;
}
