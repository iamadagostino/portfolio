'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '~/components/admin/button';
import { Checkbox, CheckboxField } from '~/components/admin/checkbox';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '~/components/admin/dialog';
import { Description, Field, FieldGroup, Label } from '~/components/admin/fieldset';
import { Input } from '~/components/admin/input';
import { Select } from '~/components/admin/select';

export function RefundOrder({ amount, ...props }: { amount: string } & React.ComponentPropsWithoutRef<typeof Button>) {
  const [isOpen, setIsOpen] = useState(false);
  const amountInputRef = useRef<HTMLInputElement>(null);
  const reasonId = useId();
  const reasonLabelId = `${reasonId}-label`;

  useEffect(() => {
    if (isOpen) {
      amountInputRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)} {...props} />
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Refund payment</DialogTitle>
        <DialogDescription>
          The refund will be reflected in the customer’s bank account 2 to 3 business days after processing.
        </DialogDescription>
        <DialogBody>
          <FieldGroup>
            <Field>
              <Label>Amount</Label>
              <Input ref={amountInputRef} name="amount" defaultValue={amount} placeholder="$0.00" />
            </Field>
            <Field>
              <Label id={reasonLabelId} htmlFor={reasonId}>Reason</Label>
              <Select id={reasonId} aria-labelledby={reasonLabelId} name="reason" defaultValue="">
                <option value="" disabled>
                  Select a reason&hellip;
                </option>
                <option value="duplicate">Duplicate</option>
                <option value="fraudulent">Fraudulent</option>
                <option value="requested_by_customer">Requested by customer</option>
                <option value="other">Other</option>
              </Select>
            </Field>
            <CheckboxField>
              <Checkbox name="notify" />
              <Label>Notify customer</Label>
              <Description>An email notification will be sent to this customer.</Description>
            </CheckboxField>
          </FieldGroup>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>Refund</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
