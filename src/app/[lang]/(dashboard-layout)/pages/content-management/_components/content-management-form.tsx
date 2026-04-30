"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getLandingContent, updateLandingContent } from "@/components/dashboards/services/apiService";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/translationContext";

const contentSchema = z.object({
  problem_1_title: z.string().min(1, "Required"),
  problem_1_desc: z.string().min(1, "Required"),
  problem_2_title: z.string().min(1, "Required"),
  problem_2_desc: z.string().min(1, "Required"),
  problem_3_title: z.string().min(1, "Required"),
  problem_3_desc: z.string().min(1, "Required"),
  problem_4_title: z.string().min(1, "Required"),
  problem_4_desc: z.string().min(1, "Required"),

  solution_1_title: z.string().min(1, "Required"),
  solution_1_desc: z.string().min(1, "Required"),
  solution_2_title: z.string().min(1, "Required"),
  solution_2_desc: z.string().min(1, "Required"),
  solution_3_title: z.string().min(1, "Required"),
  solution_3_desc: z.string().min(1, "Required"),
  solution_4_title: z.string().min(1, "Required"),
  solution_4_desc: z.string().min(1, "Required"),

  value_1_title: z.string().min(1, "Required"),
  value_1_desc: z.string().min(1, "Required"),
  value_2_title: z.string().min(1, "Required"),
  value_2_desc: z.string().min(1, "Required"),
  value_3_title: z.string().min(1, "Required"),
  value_3_desc: z.string().min(1, "Required"),
  value_4_title: z.string().min(1, "Required"),
  value_4_desc: z.string().min(1, "Required"),

  feature_1_title: z.string().min(1, "Required"),
  feature_1_desc: z.string().min(1, "Required"),
  feature_2_title: z.string().min(1, "Required"),
  feature_2_desc: z.string().min(1, "Required"),
  feature_3_title: z.string().min(1, "Required"),
  feature_3_desc: z.string().min(1, "Required"),
  feature_4_title: z.string().min(1, "Required"),
  feature_4_desc: z.string().min(1, "Required"),

  adv_1_title: z.string().min(1, "Required"),
  adv_1_desc: z.string().min(1, "Required"),
  adv_2_title: z.string().min(1, "Required"),
  adv_2_desc: z.string().min(1, "Required"),
  adv_3_title: z.string().min(1, "Required"),
  adv_3_desc: z.string().min(1, "Required"),
  adv_4_title: z.string().min(1, "Required"),
  adv_4_desc: z.string().min(1, "Required"),
});

const formSchema = z.object({
  en: contentSchema,
  ar: contentSchema,
});

type ContentFormValues = z.infer<typeof formSchema>;

const SECTIONS = [
  { id: "problem", title: "Problem" },
  { id: "solution", title: "Solution" },
  { id: "value", title: "Value" },
  { id: "feature", title: "Feature" },
  { id: "adv", title: "Advantage" },
];

export function ContentManagementForm() {
  const dictionary: any = useTranslation();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      en: {
        problem_1_title: "",
        problem_1_desc: "",
        problem_2_title: "",
        problem_2_desc: "",
        problem_3_title: "",
        problem_3_desc: "",
        problem_4_title: "",
        problem_4_desc: "",

        solution_1_title: "",
        solution_1_desc: "",
        solution_2_title: "",
        solution_2_desc: "",
        solution_3_title: "",
        solution_3_desc: "",
        solution_4_title: "",
        solution_4_desc: "",

        value_1_title: "",
        value_1_desc: "",
        value_2_title: "",
        value_2_desc: "",
        value_3_title: "",
        value_3_desc: "",
        value_4_title: "",
        value_4_desc: "",

        feature_1_title: "",
        feature_1_desc: "",
        feature_2_title: "",
        feature_2_desc: "",
        feature_3_title: "",
        feature_3_desc: "",
        feature_4_title: "",
        feature_4_desc: "",

        adv_1_title: "",
        adv_1_desc: "",
        adv_2_title: "",
        adv_2_desc: "",
        adv_3_title: "",
        adv_3_desc: "",
        adv_4_title: "",
        adv_4_desc: "",
      },
      ar: {
        problem_1_title: "",
        problem_1_desc: "",
        solution_1_title: "",
        value_1_title: "",
        feature_1_title: "",
        adv_1_title: "",
      },
    },
  });

  useEffect(() => {
    async function fetchContent() {
      try {
        const data = await getLandingContent();
        if (data && data.en && data.ar) {
          form.reset(data);
        } else {
          // Fallback initial state if API is empty or failing
          form.reset({
            en: {
              problem_1_title: "Dynamic English Title",
              problem_1_desc: "Dynamic English Desc",
              problem_2_title: "Dynamic English Title",
              problem_2_desc: "Dynamic English Desc",
              problem_3_title: "Dynamic English Title",
              problem_3_desc: "Dynamic English Desc",
              problem_4_title: "Dynamic English Title",
              problem_4_desc: "Dynamic English Desc",

              solution_1_title: "Solution Title",
              solution_1_desc: "Solution Desc",
              solution_2_title: "Solution Title",
              solution_2_desc: "Solution Desc",
              solution_3_title: "Solution Title",
              solution_3_desc: "Solution Desc",
              solution_4_title: "Solution Title",
              solution_4_desc: "Solution Desc",

              value_1_title: "Value Title",
              value_1_desc: "Value Desc",
              value_2_title: "Value Title",
              value_2_desc: "Value Desc",
              value_3_title: "Value Title",
              value_3_desc: "Value Desc",
              value_4_title: "Value Title",
              value_4_desc: "Value Desc",

              feature_1_title: "Feature Title",
              feature_1_desc: "Feature Desc",
              feature_2_title: "Feature Title",
              feature_2_desc: "Feature Desc",
              feature_3_title: "Feature Title",
              feature_3_desc: "Feature Desc",
              feature_4_title: "Feature Title",
              feature_4_desc: "Feature Desc",

              adv_1_title: "Adv Title",
              adv_1_desc: "Adv Desc",
              adv_2_title: "Adv Title",
              adv_2_desc: "Adv Desc",
              adv_3_title: "Adv Title",
              adv_3_desc: "Adv Desc",
              adv_4_title: "Adv Title",
              adv_4_desc: "Adv Desc",
            },
            ar: {
              problem_1_title: "عنوان ديناميكي بالعربي",
              problem_1_desc: "وصف ديناميكي بالعربي",
              problem_2_title: "عنوان ديناميكي بالعربي",
              problem_2_desc: "وصف ديناميكي بالعربي",
              problem_3_title: "عنوان ديناميكي بالعربي",
              problem_3_desc: "وصف ديناميكي بالعربي",
              problem_4_title: "عنوان ديناميكي بالعربي",
              problem_4_desc: "وصف ديناميكي بالعربي",

              solution_1_title: "عنوان الحل",
              solution_1_desc: "وصف الحل",
              solution_2_title: "عنوان الحل",
              solution_2_desc: "وصف الحل",
              solution_3_title: "عنوان الحل",
              solution_3_desc: "وصف الحل",
              solution_4_title: "عنوان الحل",
              solution_4_desc: "وصف الحل",

              value_1_title: "عنوان القيمة",
              value_1_desc: "وصف القيمة",
              value_2_title: "عنوان القيمة",
              value_2_desc: "وصف القيمة",
              value_3_title: "عنوان القيمة",
              value_3_desc: "وصف القيمة",
              value_4_title: "عنوان القيمة",
              value_4_desc: "وصف القيمة",

              feature_1_title: "عنوان الميزة",
              feature_1_desc: "وصف الميزة",
              feature_2_title: "عنوان الميزة",
              feature_2_desc: "وصف الميزة",
              feature_3_title: "عنوان الميزة",
              feature_3_desc: "وصف الميزة",
              feature_4_title: "عنوان الميزة",
              feature_4_desc: "وصف الميزة",

              adv_1_title: "عنوان الميزة الإضافية",
              adv_1_desc: "وصف الميزة الإضافية",
              adv_2_title: "عنوان الميزة الإضافية",
              adv_2_desc: "وصف الميزة الإضافية",
              adv_3_title: "عنوان الميزة الإضافية",
              adv_3_desc: "وصف الميزة الإضافية",
              adv_4_title: "عنوان الميزة الإضافية",
              adv_4_desc: "وصف الميزة الإضافية",
            },
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [form]);

  async function onSubmit(data: ContentFormValues) {
    setSubmitting(true);
    await updateLandingContent(data);
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-xl border bg-card/50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="w-full shadow-sm border-muted">
      <CardHeader className="border-b bg-muted/20 pb-4">
        <CardTitle className="text-xl font-semibold tracking-tight">Landing Page Content</CardTitle>
        <CardDescription className="text-muted-foreground">Manage your landing page textual content for English and Arabic. Ensure all fields are filled before saving.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs defaultValue="en" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-muted/50 rounded-lg">
                <TabsTrigger value="en" className="rounded-md transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">English (EN)</TabsTrigger>
                <TabsTrigger value="ar" className="rounded-md transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">Arabic (AR)</TabsTrigger>
              </TabsList>

              {["en", "ar"].map((lang) => (
                <TabsContent key={lang} value={lang} className="animate-in slide-in-from-bottom-2 duration-300">
                  <Tabs defaultValue="problem" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-6 p-1 bg-muted/30 rounded-lg h-auto">
                      {SECTIONS.map((section) => (
                        <TabsTrigger
                          key={section.id}
                          value={section.id}
                          className="rounded-md transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm py-2"
                        >
                          {section.title}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {SECTIONS.map((section) => (
                      <TabsContent key={section.id} value={section.id} className="space-y-4 animate-in fade-in-50 duration-300">
                        <div className="border-b pb-2">
                          <h3 className="text-lg font-medium">{section.title} Content</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-6 bg-card rounded-lg p-2">
                          {[1, 2, 3, 4].map((num) => (
                            <div key={num} className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-muted/5 p-4 border rounded-md shadow-sm">
                              <h4 className="col-span-1 lg:col-span-2 font-semibold text-sm text-foreground/80 border-b pb-2">{section.title} {num}</h4>
                              <FormField
                                control={form.control}
                                name={`${lang}.${section.id}_${num}_title` as any}
                                render={({ field }) => (
                                  <FormItem className="space-y-1.5 h-full">
                                    <FormLabel className="text-sm font-medium">Title</FormLabel>
                                    <FormControl>
                                      <Input className="focus-visible:ring-1" placeholder={`Enter ${section.title.toLowerCase()} ${num} title...`} {...field} />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`${lang}.${section.id}_${num}_desc` as any}
                                render={({ field }) => (
                                  <FormItem className="space-y-1.5 h-full lg:row-span-2">
                                    <FormLabel className="text-sm font-medium">Description</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        className="resize-none focus-visible:ring-1 min-h-[120px] h-full"
                                        placeholder={`Enter ${section.title.toLowerCase()} ${num} description...`}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                  </FormItem>
                                )}
                              />
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </TabsContent>
              ))}
            </Tabs>

            <div className="flex justify-end pt-6 border-t">
              <Button type="submit" disabled={submitting} className="min-w-[140px] shadow-sm transition-all hover:shadow-md">
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
