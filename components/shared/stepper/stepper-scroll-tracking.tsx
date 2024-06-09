import { Step, type StepItem, Stepper, useStepper } from "./";
import { Button } from "../../../components/ui/button";
import OpenstackAccessForm from "../../forms/openstack-access-form";
import ConfigureServerInstanceForm from "../../forms/config-server-form";
import ConfigureKeycloakForm from "../../forms/config-keycloak-form";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import {
  Flavor,
  Keypair,
  Network,
  OpenstackConfig,
  Server,
} from "../../../interfaces/openstack";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../../ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { toast } from "sonner";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Progress } from "../../ui/progress";
import { ConfirmDialog } from "../dialogs/confirm";

const steps = [
  {
    label: "Openstack Access",
    children: <OpenstackAccessForm />,
  },
  {
    label: "Configure Server Instance",
    children: <ConfigureServerInstanceForm />,
  },
  {
    label: "Configure Keycloak",
    children: <ConfigureKeycloakForm />,
  },
] satisfies StepItem[];

export default function StepperScrollTracking() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Stepper
        orientation="vertical"
        initialStep={0}
        steps={steps}
        scrollTracking
        // state='error'
      >
        {steps.map((stepProps, index) => {
          return (
            <Step key={stepProps.label} {...stepProps}>
              {stepProps.children}
            </Step>
          );
        })}
        <FinalStep />
      </Stepper>
    </div>
  );
}

const FinalStep = () => {
  const { hasCompletedAllSteps } = useStepper();
  const [data, setData] = useState<OpenstackConfig>({} as OpenstackConfig);
  const [keycloakUrl, setKeycloakUrl] = useState<string>("");
  const [cookies] = useCookies([
    "openstack_user_id",
    "current_step",
    "openstack_auth_token",
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // fetch data from /api/openstack endpoint
  useEffect(() => {
    const getData = async () => {
      await fetch("/api/openstack", {
        headers: {
          userId: cookies?.openstack_user_id as string,
        },
      })
        .then(async (res) => await res.json())
        .then(({ data }) => setData(data))
        .catch((error) => {
          console.error(error);
          toast.error("An error occurred!");
        });
    };
    if (cookies?.current_step == 3) {
      getData();
    }
  }, [cookies?.current_step]);

  const fetchData = async () => {
    const xAuthToken = cookies?.openstack_auth_token;
    const userId = cookies?.openstack_user_id;

    if (
      !userId ||
      !xAuthToken ||
      xAuthToken === "undefined" ||
      userId === "undefined"
    ) {
      return;
    }
    const response = await fetch(`/api/openstack/servers`, {
      headers: {
        "X-Auth-Token": xAuthToken,
        userId: userId as string,
      },
    });
    const body = await response.json();

    // find server with name "keycloak-server" and set the ip address
    const keycloakServer: Server = body?.data.find((server: Server) =>
      server.name.includes("keycloak-server")
    );

    if (!keycloakServer) {
      toast.error("Keycloak Server not found!");
      return;
    }

    // convert the addresses object to an array and get the first address
    const addresses = Object.values(keycloakServer?.addresses)[0];
    const ipAddr = addresses[0]?.addr;
    setKeycloakUrl(`http://${ipAddr}:${data?.keycloakPort}`);
    toast.success("Deployment Completed Successfully!");

    // Clear the interval once the deployment is successful
    clearInterval(interval);
  };

  let interval: any;

  const loadAndServeKeycloakLink = () => {
    interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 1;
        } else {
          fetchData();
          return 100;
        }
      });
    }, 3000);
  };

  const handleDeploy = async () => {
    // send a POST request to /api/openstack/stack
    await fetch("/api/openstack/stack", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        userId: cookies?.openstack_user_id as string,
        xAuthToken: cookies?.openstack_auth_token as string,
      },
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        setLoading(true);
        if (res.status === 200) {
          toast.success("Deployment Started Successfully!");

          loadAndServeKeycloakLink();
          // resetSteps()
        } else {
          toast.error("An error occurred!");
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("An error occurred!");
      });
  };

  if (!hasCompletedAllSteps) {
    return null;
  }

  return (
    <>
      <div className="h-fit flex flex-col items-center justify-center border bg-secondary text-primary rounded-md p-4">
        <div className="w-full flex justify-between mb-4">
          <h2 className="flex items-center text-2xl font-bold mb-1">
            Review Configuration
          </h2>
          <EditDialog data={data} setData={setData} />
        </div>

        {/* Openstack Access Config */}
        <div className="w-full flex flex-col gap-2 my-2">
          <h3 className="text-lg font-bold">Openstack Access Config</h3>
          <div className="w-full flex justify-between">
            <span>Username </span>
            <span className="text-gray-500">{data?.username}</span>
          </div>
          <div className="w-full flex justify-between">
            <span>Project </span>
            <span className="text-gray-500">{data?.project}</span>
          </div>
          <div className="w-full flex justify-between">
            <span>Domain </span>
            <span className="text-gray-500">{data?.domain}</span>
          </div>
          <div className="w-full flex justify-between">
            <span>Base URL </span>
            <span className="text-gray-500">{data?.baseUrl}</span>
          </div>
        </div>

        {/* Server Instance Config */}
        <div className="w-full flex flex-col gap-2 my-2">
          <h3 className="text-lg font-bold">Server Instance Config</h3>
          <div className="w-full flex justify-between">
            <span>Flavor </span>
            <span className="text-gray-500">{data?.flavor}</span>
          </div>
          <div className="w-full flex justify-between">
            <span>Keypair </span>
            <span className="text-gray-500">{data?.keypair}</span>
          </div>
          <div className="w-full flex justify-between">
            <span>Network </span>
            <span className="text-gray-500">{data?.network}</span>
          </div>
          <div className="w-full flex justify-between">
            <span>Keycloak Port </span>
            <span className="text-gray-500">{data?.keycloakPort}</span>
          </div>
        </div>

        {/* Keycloak Config */}
        <div className="w-full flex flex-col gap-2 my-2">
          <h3 className="text-lg font-bold">Keycloak Config</h3>
          <div className="w-full flex justify-between">
            <span>Realm Name </span>
            <span className="text-gray-500">{data?.realmName}</span>
          </div>
          <div className="w-full flex justify-between">
            <span>Admin Username </span>
            <span className="text-gray-500">{data?.adminUsername}</span>
          </div>
          <div className="w-full flex justify-between">
            <span>Admin Password </span>
            <span className="text-gray-500">{data?.adminPassword}</span>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-end gap-2">
        <ConfirmDialog
          title="Deploy Configuration"
          description="Are you sure you want to deploy this configuration?"
          buttonText="Deploy"
          onConfirm={handleDeploy}
        />
      </div>

      {/* loading progress & displaying deployed keycloak instance url */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          {!!keycloakUrl ? (
            <DeploySuccessCard url={keycloakUrl} />
          ) : (
            <DeployProgress progress={progress} />
          )}
        </div>
      )}
    </>
  );
};

function EditDialog({
  data,
  setData,
}: {
  data: OpenstackConfig;
  setData: React.Dispatch<React.SetStateAction<OpenstackConfig>>;
}) {
  const { flavors, keyPairs, networks } = useStepper();
  const [cookies] = useCookies(["openstack_user_id"]);
  const [fields, setFields] = useState({
    flavor: data?.flavor,
    keypair: data?.keypair,
    network: data?.network,
    keycloakPort: data?.keycloakPort,
    realmName: data?.realmName,
    adminUsername: data?.adminUsername,
    adminPassword: data?.adminPassword,
  });

  // send a PUT request to update the configuration /api/openstack
  const handleUpdate = async () => {
    try {
      const response = await fetch("/api/openstack", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          userId: cookies?.openstack_user_id as string,
        },
        body: JSON.stringify(fields),
      });
      const data = await response.json();
      if (response.status === 200) {
        toast.success("Configuration Updated Successfully!");
        setData(data?.data);
        // nextStep()
      } else {
        toast.error("Error Updating Configuration!");
      }
    } catch (error) {
      toast.error("An error occured!");
    }
  };

  const renderFlavor = (flavor: Flavor) => {
    const vcpus = flavor.vcpus;
    const ram =
      flavor.ram > 1024 ? flavor.ram / 1024 + "GB" : flavor.ram + "MB";
    const disk = flavor.disk;

    return (
      <SelectItem key={flavor.id} value={flavor.name}>
        {flavor.name}
        <span className="text-xs ml-2">{`${vcpus}vCPU ${ram} ${disk}GB`}</span>
      </SelectItem>
    );
  };

  useEffect(() => {
    setFields({
      flavor: data?.flavor,
      keypair: data?.keypair,
      network: data?.network,
      keycloakPort: data?.keycloakPort,
      realmName: data?.realmName,
      adminUsername: data?.adminUsername,
      adminPassword: data?.adminPassword,
    });
  }, [data]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center gap-x-3 bg-gray-100 border border-gray-300 px-3 py-1 rounded-md shadow hover:cursor-pointer">
          <span>Edit</span> <Pencil2Icon />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Configuration</DialogTitle>
          <DialogDescription>
            Make changes here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full grid gap-4 py-4">
          {[
            { name: "flavor", type: "select" },
            { name: "keypair", type: "select" },
            { name: "network", type: "select" },
            { name: "keycloakPort", type: "input" },
            { name: "realmName", type: "input" },
            { name: "adminUsername", type: "input" },
            { name: "adminPassword", type: "input" },
          ].map(({ name, type }) => {
            return (
              <div
                className="w-full grid grid-cols-4 items-center gap-4"
                key={name}
              >
                <Label htmlFor={name} className="text-right capitalize">
                  {name.replace(/([A-Z])/g, " $1")}
                </Label>
                {type === "input" ? (
                  <Input
                    id={name}
                    // @ts-ignore
                    defaultValue={fields[name]}
                    onChange={(event) => {
                      setFields((prev: any) => ({
                        ...prev,
                        [name]: event.target.value,
                      }));
                    }}
                    className="col-span-3"
                  />
                ) : (
                  <Select
                    defaultValue={
                      // @ts-ignore
                      fields[name]
                    }
                    value={
                      // @ts-ignore
                      fields[name]
                    }
                    onValueChange={
                      // @ts-ignore
                      (value) =>
                        setFields((prev) => ({ ...prev, [name]: value }))
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder={"Select a " + name} />
                    </SelectTrigger>
                    <SelectContent className="col-span-3">
                      <SelectGroup>
                        {name == "flavor" && flavors.length > 0 && (
                          <>
                            <SelectLabel>{name} vCPU RAM Disk</SelectLabel>
                            {flavors?.map((flavor: Flavor) =>
                              renderFlavor(flavor)
                            )}
                          </>
                        )}

                        {name == "keypair" && keyPairs.length > 0 && (
                          <>
                            <SelectLabel>{name}</SelectLabel>
                            {keyPairs.map((keypair: Keypair) => (
                              <SelectItem
                                key={keypair.keypair.name}
                                value={keypair.keypair.name}
                              >
                                {keypair.keypair.name}
                              </SelectItem>
                            ))}
                          </>
                        )}

                        {name == "network" && networks.length > 0 && (
                          <>
                            <SelectLabel>{name}</SelectLabel>
                            {networks.map((network: Network) => (
                              <SelectItem key={network.id} value={network.id}>
                                {network.label}
                              </SelectItem>
                            ))}
                          </>
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              </div>
            );
          })}
        </div>
        <DialogFooter className="">
          <DialogClose>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={handleUpdate}
            // disable if no changes
            disabled={
              JSON.stringify({
                flavor: data?.flavor,
                keypair: data?.keypair,
                network: data?.network,
                keycloakPort: data?.keycloakPort,
                realmName: data?.realmName,
                adminUsername: data?.adminUsername,
                adminPassword: data?.adminPassword,
              }) === JSON.stringify(fields)
            }
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../..//components/ui/card";
import Link from "next/link";

function DeploySuccessCard({ url }: { url: string }) {
  return (
    <Card className="w-[550px]">
      <CardHeader>
        <CardTitle>Deployment Successful 🚀🚀</CardTitle>
        <CardDescription>
          Your Keycloak Server has been deployed successfully. You can access it
          using the URL below.
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex justify-between">
        <Link
          href={url}
          target="_blank"
          passHref
          className="text-primary hover:text-primary-dark w-full mx-auto"
        >
          <Button className="w-full">Visit Keycloak Server</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function DeployProgress({ progress }: { progress: number }) {
  return (
    <Card className="w-[550px]">
      <CardHeader>
        <CardTitle>Deployment in progress ⏳⏳</CardTitle>
        <CardDescription>
          Your Keycloak Server is being deployed. You can access it once the
          deployment is complete.
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex justify-between">
        <Progress value={progress} />
        <span className="text-inherit ml-2">{progress}%</span>
      </CardFooter>
    </Card>
  );
}
