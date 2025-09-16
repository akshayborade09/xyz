interface DetailItemProps {
  label: string;
  value: string;
}

/**
 * @component DetailItem
 * @description Displays a label-value pair for detailed information
 * @status Active
 * @example
 * <DetailItem label="Status" value="Active" />
 */
export function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div>
      <div className='text-sm font-medium text-muted-foreground mb-1'>
        {label}
      </div>
      <div className='font-medium text-foreground'>{value}</div>
    </div>
  );
}
