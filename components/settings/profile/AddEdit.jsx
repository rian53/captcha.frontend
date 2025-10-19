import React, { useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "sonner";
import { userService } from "@/services/user.service";

import { Button } from "@/components/ui/button";
import { CircleUserRound } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertBlock } from "@/components/shared/alert-block";

// validation schema for create
const createSchema = Yup.object().shape({
  name: Yup.string().required("El nombre es obligatorio"),
  email: Yup.string().email("E-mail inválido").required("El e-mail es obligatorio"),
  phoneNumber: Yup.string().nullable(),
  country: Yup.string().nullable(),
  address: Yup.string().nullable(),
});

// validation schema for update - campos opcionais
const updateSchema = Yup.object().shape({
  name: Yup.string().optional(),
  email: Yup.string().email("E-mail inválido").optional(),
  phoneNumber: Yup.string().nullable().optional(),
  country: Yup.string().nullable().optional(),
  address: Yup.string().nullable().optional(),
});

export function AddEdit({ user }) {
  const isAddMode = !user;
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      country: user?.country || "",
      address: user?.address || "",
    }),
    [user]
  );

  const validationSchema = useMemo(
    () => isAddMode ? createSchema : updateSchema,
    [isAddMode]
  );

  const form = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, submitCount, isSubmitSuccessful },
    control,
  } = form;

  useEffect(() => {
    if (!userService.userValue) router.push("/account/login");
  }, [router]);

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  const onSubmit = useCallback(
    async (data) => {
      try {
        if (isAddMode) {
          await userService.register(data);
          toast.success("¡Cliente creado con éxito!", {
            keepAfterRouteChange: true,
          });
          router.push("/home");
        } else {
          // Enviar apenas os campos que foram enviados no formulário
          const payload = {};
          if (data.name) payload.name = data.name;
          if (data.email) payload.email = data.email;
          if (data.phoneNumber) payload.phoneNumber = data.phoneNumber;
          if (data.country) payload.country = data.country;
          if (data.address) payload.address = data.address;
          
          await userService.update(user.id, payload);
          
          const updated = {
            ...userService.userValue,
            ...payload,
          };
          localStorage.setItem("user", JSON.stringify(updated));
          toast.success("¡Perfil actualizado con éxito!");
        }
      } catch (err) {
        toast.error(isAddMode ? err : "Error al actualizar el perfil");
      }
    },
    [isAddMode, router, user]
  );

  const fields = [
    { name: "name", label: "Nombre", placeholder: "Tu nombre", type: "text" },
    {
      name: "email",
      label: "E-mail",
      placeholder: "tu@ejemplo.com",
      type: "email",
    },
    {
      name: "phoneNumber",
      label: "Teléfono",
      placeholder: "+55 (11) 99999-9999",
      type: "tel",
    },
    {
      name: "country",
      label: "País",
      placeholder: "Brasil",
      type: "text",
    },
    {
      name: "address",
      label: "Dirección",
      placeholder: "Tu dirección completa",
      type: "text",
    },
  ];

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {submitCount > 0 && !isSubmitSuccessful && (
          <AlertBlock type="error">
            Revisa los errores en el formulario.
          </AlertBlock>
        )}

        {fields.map(({ name, label, placeholder, type }) => (
          <FormField
            key={name}
            control={control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type={type}
                    placeholder={placeholder}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" isLoading={isSubmitting}>
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  );
}
