"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  filename: z.string().min(2, {
    message: "Filename must be at least 2 characters.",
  }),
  file: z
    .instanceof(FileList)
    .refine((file) => file?.length == 1, "File is required."),
});

const UploadFilePopUpOrg = () => {
  const user = useUser();
  const organization = useOrganization();
  let token: string | undefined = undefined;
  if (user.isLoaded && organization?.isLoaded) {
    token = organization?.organization?.id || user.user?.id;
  }

  const generateUploadUrl = useMutation(api.file.generateUploadUrl);
  const createfile = useMutation(api.file.createFile);
  const [DialogueOpen, setDialogueOpen] = useState(false);
  const { toast } = useToast();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      filename: "",
      file: undefined,
    },
  });
  const fileRef = form.register("file");
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    console.log(values.file);
    if (!token) {
      return;
    }
    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": values.file[0].type },
      body: values.file[0],
    });
    const { storageId } = await result.json();

    try {
      await createfile({
        name: values.filename,
        orgId: token,
        fileId: storageId,
      });
      form.reset();
      setDialogueOpen(false);
      toast({
        title: "File uploaded successfully",
        variant: "success",
        description: "Now everyone can see your file",
      });
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        variant: "destructive",
        description: "Your file could not be uploaded, try again later",
      });
    }
  }

  return (
    <div>
      <Dialog
        open={DialogueOpen}
        onOpenChange={(open) => {
          setDialogueOpen(open);
          form.reset();
        }}
      >
        <DialogTrigger asChild>
          <Button>Upload File</Button>
        </DialogTrigger>
        <DialogContent className={"sm:w-[500px] w-[90%] sm:flex rounded-lg"}>
          <DialogHeader>
            <DialogTitle className={"flex font-bold mb-5"}>
              Upload Your File Here
            </DialogTitle>
            <h1 className={"flex font-medium text-gray-400"}>
              This file will be accessible by anyone in this Organization
            </h1>
            <DialogDescription>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="filename"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={"font-medium flex mt-4"}>
                          Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            type={"text"}
                            placeholder="file name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={"font-medium"}>File</FormLabel>
                        <FormControl>
                          <Input type={"file"} {...fileRef} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className={"flex gap-1"}
                  >
                    {form.formState.isSubmitting && (
                      <Loader2 className={"h-4 w-4 animate-spin"} />
                    )}
                    Submit
                  </Button>
                </form>
              </Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadFilePopUpOrg;
