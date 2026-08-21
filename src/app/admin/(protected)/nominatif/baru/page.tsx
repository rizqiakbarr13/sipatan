import { BidangForm } from "../bidang-form";
import { createBidang } from "../actions";

export default function BidangBaruPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-zinc-900">Tambah Bidang</h1>
      <BidangForm
        action={async (_prevState, formData) => {
          "use server";
          const result = await createBidang(formData);
          return result ?? {};
        }}
      />
    </div>
  );
}
