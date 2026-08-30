import type { Metadata } from "next";
import { Alert } from "@/components/ui/alert";
import { Avatar } from "@/components/ui/avatar";
import { Badge, Tag } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormCard, StatCard } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { Input, SearchInput, Select, Textarea } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";
import { Checkbox, Radio, Toggle } from "@/components/ui/toggle";

export const metadata: Metadata = { title: "Kitchen Sink" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-h1 text-[28px] text-terracotta">{title}</h2>
      {children}
    </section>
  );
}

export default function KitchenSinkPage() {
  return (
    <div className="flex max-w-4xl flex-col gap-12 pb-16">
      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Send Thank You</Button>
          <Button variant="secondary">Edit Guest List</Button>
          <Button variant="ghost">Cancel Changes</Button>
          <Button variant="destructive">Delete Design</Button>
          <Button disabled>Send Thank You</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small Action</Button>
          <Button size="md">Medium Action</Button>
          <Button size="lg">Large Action</Button>
        </div>
      </Section>

      <Section title="Inputs">
        <div className="grid max-w-md gap-4">
          <Input placeholder="Enter guest name..." />
          <Input defaultValue="Olivia & Liam Henderson" />
          <Field label="Email" error="Please enter a valid email address.">
            <Input defaultValue="invalid_email@example" invalid />
          </Field>
          <Input disabled placeholder="Locked database field" />
          <Textarea defaultValue="We are so incredibly grateful for the gorgeous ceramic vase you gifted us. It looks beautiful in our living room and will be cherished for years to come!" />
          <Select defaultValue="shower">
            <option value="shower">Bridal Shower</option>
            <option value="college">College Friends</option>
          </Select>
          <SearchInput placeholder="Search guests..." />
        </div>
      </Section>

      <Section title="Form Elements">
        <div className="flex flex-col gap-3">
          <Checkbox label="Digital Card Sent Successfully" defaultChecked />
          <Radio name="ks-radio" label="Primary Attendant (Option Selected)" defaultChecked />
          <div className="flex gap-6">
            <Toggle label="Toggle On" defaultChecked />
            <Toggle label="Toggle Off" />
          </div>
        </div>
      </Section>

      <Section title="Cards">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <StatCard label="Letters Opened" value={132} detail="78% of live cards" />
          <FormCard
            heading="Card Heading Element"
            description="Include key configuration parameters and controls inside this standard structured container."
          >
            <Button>Save Design</Button>
          </FormCard>
        </div>
      </Section>

      <Section title="Badges & Tags">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="active">Active Guest</Badge>
          <Badge variant="pending">Draft / Pending</Badge>
          <Badge variant="archived">Archived</Badge>
          <Badge variant="hot">HOT</Badge>
          <Tag>Bridal Shower</Tag>
        </div>
      </Section>

      <Section title="Alerts">
        <div className="flex flex-col gap-3">
          <Alert variant="success">Thank you web page created! The link is now live.</Alert>
          <Alert variant="error">Error occurred while uploading the couple photo. Try again.</Alert>
          <Alert variant="warning">You have 12 unsaved greeting templates in draft mode.</Alert>
          <Alert variant="info">Wedding date is set to October 14th, 2024.</Alert>
        </div>
      </Section>

      <Section title="Table">
        <Table>
          <TableHead>
            <TableHeaderCell>Guest</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell className="text-right">Actions</TableHeaderCell>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Michael &amp; Sarah Jenkins</TableCell>
              <TableCell><Badge variant="active">Active</Badge></TableCell>
              <TableCell className="text-right">
                <span className="text-[14px] font-medium text-terracotta">Edit</span>
              </TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell className="font-medium">Emily Watson (Selected)</TableCell>
              <TableCell><Badge variant="active">Active</Badge></TableCell>
              <TableCell className="text-right">
                <span className="text-[14px] font-medium text-danger">Delete</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Pagination
          page={1}
          pageSize={10}
          totalCount={184}
          itemLabel="guests"
          hrefForPage={(p) => `/admin/kitchen-sink?page=${p}`}
        />
      </Section>

      <Section title="Empty State">
        <EmptyState
          title="No Thank Yous Sent Yet"
          description="Select guests and start generating custom greeting pages to fill this table."
        />
      </Section>

      <Section title="Avatars">
        <div className="flex items-end gap-4">
          <Avatar name="Olivia Henderson" size="sm" />
          <Avatar name="Julian Charlotte" size="md" tone="sage" />
          <Avatar name="Emily Watson" size="lg" />
        </div>
      </Section>
    </div>
  );
}
