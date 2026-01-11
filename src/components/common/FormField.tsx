import { Form } from 'antd';
import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, error, required, children, className = '' }: FormFieldProps) {
  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={error ? 'error' : undefined}
      help={error}
      className={className}
    >
      {children}
    </Form.Item>
  );
}
