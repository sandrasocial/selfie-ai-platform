import { Form, FormSection, FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, Radio } from '@/components/ui/radio';
import { Button } from '@/components/ui/button';

export default function FormTest() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-4xl font-['Bodoni_Moda'] mb-8">Form Components</h1>
      
      <Form>
        <FormSection title="Test All Components">
          <FormField label="Email Input" required>
            <Input type="email" placeholder="sandra@selfie.ai" />
          </FormField>
          
          <FormField label="Password" helper="Min 8 characters">
            <Input type="password" />
          </FormField>
          
          <FormField label="Country">
            <Select 
              options={[
                { value: 'us', label: 'United States' },
                { value: 'uk', label: 'United Kingdom' }
              ]} 
            />
          </FormField>
          
          <FormField>
            <Checkbox label="Subscribe to updates" />
          </FormField>
          
          <Button type="submit" fullWidth>
            Test Submit
          </Button>
        </FormSection>
      </Form>
    </div>
  );
}