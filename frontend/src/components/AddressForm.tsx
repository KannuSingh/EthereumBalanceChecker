import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

// Define form schema with Zod
const formSchema = z.object({
  address: z
    .string()
    .min(1, { message: "Ethereum address is required" })
    .regex(/^0x[a-fA-F0-9]{40}$/, {
      message: "Invalid Ethereum address format",
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddressFormProps {
  onSubmit: (address: string) => Promise<void>;
  loading: boolean;
}

export default function AddressForm({ onSubmit, loading }: AddressFormProps) {
  const [exampleClicked, setExampleClicked] = useState(false);

  // Define the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    await onSubmit(values.address);
  };

  const fillExampleAddress = () => {
    // Vitalik's address as an example
    form.setValue("address", "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
    setExampleClicked(true);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ethereum Address
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="0x..."
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fillExampleAddress}
              disabled={loading || exampleClicked}
              className="text-xs"
            >
              {exampleClicked ? "Example Added" : "Use Example Address"}
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Check Balances"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}