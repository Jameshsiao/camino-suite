import React from "react";
import * as Yup from "yup";
import { Network } from "../../@types/store";
import { useAppDispatch } from "../../hooks/reduxHooks";
import {
  Typography,
  TextField,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useFormik, Form, FormikProvider } from "formik";
import { Button } from "@mui/material";
import { AvaNetwork } from "wallet/AvaNetwork";
import store from "wallet/store";
import { addNetworks } from "../../redux/slices/network";
import { useStore } from "Explorer/useStore";
import axios from "axios";

export default function AddNewNetwork({
  networks,
  handleClose,
  switchNetwork,
  selectedEvent,
  selectedNetwork,
}) {
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { updateNetworks } = useStore();
  const dispatch = useAppDispatch();
  const getInitialValues = () => {
    let _newNetwork = {
      id: "",
      name: "",
      protocol: "https",
      host: "",
      magellanAddress: "",
      port: 0,
      predefined: false,
    };
    if (selectedEvent === "edit") {
      const network = networks.find((net) => net.id === selectedNetwork);
      _newNetwork = {
        id: network.id,
        name: network.name,
        protocol: network.protocol,
        port: network.port,
        predefined: network.readonly,
        magellanAddress: network.explorerUrl,
        host: network.url.split("/")[2].split(":")[0],
      };
      return network as Network;
    }

    return _newNetwork;
  };

  const EventSchema = Yup.object().shape({
    id: Yup.string(),
    name: Yup.string().required("This field is required").min(3, "Too Short!"),
    host: Yup.string().required("This field is required"),
    protocol: Yup.string()
      .required("This field is required")
      .min(4, "Protocol must be at least 4 characters long")
      .max(5, "Protocol must be no more than 5 characters long"),
    magellanAddress: Yup.string()
      .required("This field is required")
      .min(10, "URL must be at least 10 characters")
      .max(200, "URL must be no more than 200 characters")
      .matches(/^https?:\/\/.+/, "URL must start with http:// or https://"),
    port: Yup.number()
      .positive()
      .required("This field is required")
      .integer()
      .min(1)
      .max(65535)
      .typeError("Port should be a number and should not start with 0")
      .required("This field is required"),
    predefined: Yup.boolean(),
  });

  const handleDuplicateNetworkId = (
    NewNetwork: Network,
    networks: Network[]
  ) => {
    const _duplicate = networks.find(
      (item) => item.id === NewNetwork.id && item.predefined === false
    );
    if (_duplicate) return true;
    return false;
  };
  async function tryConnection(
    url,
    credential = false
  ): Promise<number | null> {
    try {
      let resp = await axios.post(
        url + "/ext/info",
        {
          jsonrpc: "2.0",
          id: 1,
          method: "info.getNetworkID",
        },
        {
          withCredentials: credential,
        }
      );
      return parseInt(resp.data.result.networkID);
    } catch (err) {
      return null;
    }
  }
  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: EventSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const newNetwork = {
          id: values.name.replace(/\s/g, "-").toLowerCase(),
          name: values.name,
          protocol: values.protocol,
          host: values.host,
          magellanAddress: values.magellanAddress,
          port: values.port,
          predefined: values.predefined,
        };
        if (handleDuplicateNetworkId(newNetwork, networks)) {
          setSubmitting(false);
          setError("Network Name already exists");
          return;
        }
        setIsLoading(true);
        let url = `${newNetwork.protocol}://${newNetwork.host}:${newNetwork.port}`;
        let findNetwork = store.state.Network.networksCustom?.findIndex(
          (network) => network.id === selectedNetwork
        );
        let net = new AvaNetwork(
          newNetwork.name,
          url,
          newNetwork.id,
          newNetwork.magellanAddress,
          ""
        );
        if (selectedEvent === "edit")
          net = {
            ...net,
            id: store.state.Network.networksCustom[findNetwork].id,
          } as AvaNetwork;
        let credNum = await tryConnection(url, true);
        let noCredNum = await tryConnection(url);

        let validNetId = credNum || noCredNum;

        if (!validNetId) {
          setError("Camino Network Not Found");
          setIsLoading(false);
          return;
        }
        if (selectedEvent === "edit" && findNetwork !== -1) {
          store.dispatch("Network/editNetwork", { net, findNetwork });
        } else if (selectedEvent === "add") {
          store.dispatch("Network/addCustomNetwork", net);
        }
        let allNetworks = store.getters["Network/allNetworks"];
        dispatch(addNetworks(allNetworks));
        updateNetworks(allNetworks);
        switchNetwork(net);
        setIsLoading(false);
        setSubmitting(false);
        resetForm();
        handleClose();
      } catch (error) {
        console.error(error);
      }
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <DialogContent sx={{ pb: 0, overflowY: "unset" }}>
          <TextField
            fullWidth
            label="Network Name"
            {...getFieldProps("name")}
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name && errors.name}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Protocol"
            {...getFieldProps("protocol")}
            inputProps={{ maxLength: 5 }}
            error={Boolean(touched.protocol && errors.protocol)}
            helperText={touched.protocol && errors.protocol}
            sx={{ mb: 3, "& fieldset": { borderRadius: "12px" } }}
          />

          <TextField
            fullWidth
            label="Host"
            {...getFieldProps("host")}
            error={Boolean(touched.host && errors.host)}
            helperText={touched.host && errors.host}
            sx={{ mb: 3, "& fieldset": { borderRadius: "12px" } }}
          />

          <TextField
            fullWidth
            label="Port"
            type="number"
            {...getFieldProps("port")}
            error={Boolean(touched.port && errors.port)}
            helperText={touched.port && errors.port}
            sx={{ mb: 3, "& fieldset": { borderRadius: "12px" } }}
          />

          <TextField
            fullWidth
            label="Magellan Address"
            {...getFieldProps("magellanAddress")}
            error={Boolean(touched.magellanAddress && errors.magellanAddress)}
            helperText={touched.magellanAddress && errors.magellanAddress}
            sx={{ mb: 3, "& fieldset": { borderRadius: "12px" } }}
          />
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
        </DialogContent>

        <DialogActions
          sx={{ display: "flex", justifyContent: "center", mb: 2, gap: 2 }}
        >
          <Button disabled={isLoading} variant="outlined" type="submit">
            {selectedEvent === "add" ? <>Add Network</> : <>Edit Network</>}
          </Button>
          <Button variant="contained" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Form>
    </FormikProvider>
  );
}
