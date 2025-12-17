import {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
} from '@/components/ui/checkbox';
import { CheckIcon } from '@/components/ui/icon';
import { Dispatch, ReactNode, SetStateAction } from 'react';
interface ICheckBoxProps {
  value: boolean;
  title: ReactNode;
  setIsCheck: Dispatch<SetStateAction<boolean>>;
}
export default function CheckBox({
  value,
  title,
  setIsCheck,
}: Readonly<ICheckBoxProps>) {
  return (
    <Checkbox
      value="toggle"
      isChecked={value}
      onChange={setIsCheck}
      className="flex items-center justify-center"
    >
      <CheckboxIndicator className='bg-primary'>
        <CheckboxIcon as={CheckIcon} />
      </CheckboxIndicator>
      <CheckboxLabel className="items-center">{title}</CheckboxLabel>
    </Checkbox>
  );
}
