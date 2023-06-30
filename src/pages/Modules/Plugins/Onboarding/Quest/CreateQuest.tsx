/* eslint-disable max-len */
import {
  useCreateQuestMutation,
  useGetAllOnboardingQuestsQuery,
  useUpdateQuestMutation
} from "@api/onboarding.api";
import { PluginDefinition } from "@aut-labs-private/sdk";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { FormHelperText } from "@components/Fields";
import { StepperButton } from "@components/Stepper";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Stack,
  Link as BtnLink,
  Typography,
  styled
} from "@mui/material";
import { allRoles } from "@store/Community/community.reducer";
import { AutSelectField } from "@theme/field-select-styles";
import { memo, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams
} from "react-router-dom";
import { RequiredQueryParams } from "@api/RequiredQueryParams";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { QuestDates } from "@auth/auth.reducer";
import { autUrls } from "@api/environment";
import { addMinutes } from "date-fns";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const Strong = styled("strong")(({ theme }) => ({
  // color: theme.palette.primary.main
}));

interface PluginParams {
  plugin: PluginDefinition;
}

const CreateQuest = ({ plugin }: PluginParams) => {
  const [roles] = useState(useSelector(allRoles));
  const [searchParams] = useSearchParams();
  const questDates = useSelector(QuestDates);
  const [initialized, setInitialized] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const urls = autUrls();

  console.log("questDates: ", questDates);
  const {
    control,
    handleSubmit,
    getValues,
    reset: resetForm,
    formState
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      // description: "",
      // durationInDays: questDurationInDays(),
      // startDate: addMinutes(new Date(), 40), // @TO-USE for testing - 30 minutes
      startDate: null,
      role: null
    }
  });

  const { quests, quest } = useGetAllOnboardingQuestsQuery(
    plugin.pluginAddress,
    {
      selectFromResult: ({ data }) => ({
        quests: data || [],
        quest: (data || []).find(
          (q) => q.questId === +searchParams.get(RequiredQueryParams.QuestId)
        )
      })
    }
  );

  const [
    createQuest,
    {
      error: createError,
      isError: createIsError,
      data: newQuest,
      isSuccess: createIsSuccess,
      isLoading: createIsLoading,
      reset: createReset
    }
  ] = useCreateQuestMutation();

  const [
    updateQuest,
    {
      error: updateError,
      isError: updateIsError,
      data: updatedQuest,
      isSuccess: updateIsSuccess,
      isLoading: updateIsLoading,
      reset: updateReset
    }
  ] = useUpdateQuestMutation();

  const onSubmit = async () => {
    const values = getValues();
    const startDate = Math.floor(new Date(values.startDate).getTime() / 1000);
    if (quest?.questId) {
      updateQuest({
        ...quest,
        pluginAddress: plugin.pluginAddress,
        role: values.role,
        // durationInDays: 2,
        durationInDays: questDates.durationInHours,
        startDate,
        metadata: {
          name:
            values.title || roles.find((r) => r.id === values.role)?.roleName,
          description: "",
          properties: {}
        }
      });
    } else {
      createQuest({
        pluginAddress: plugin.pluginAddress,
        role: values.role,
        // durationInDays: 2,
        durationInDays: questDates.durationInHours,
        startDate,
        metadata: {
          name:
            values.title || roles.find((r) => r.id === values.role)?.roleName,
          description: "",
          properties: {}
        }
      });
    }
  };

  useEffect(() => {
    if (!initialized) {
      if (!quest && questDates?.startDate) {
        resetForm({
          startDate: questDates.startDate
        });
      } else {
        resetForm({
          title: quest.metadata.name,
          startDate: new Date(quest.startDate),
          role: quest.role
        });
        setInitialized(true);
      }
    }
  }, [initialized, quest, questDates]);

  const path = useMemo(() => {
    if (updateIsSuccess) {
      return location.pathname.replaceAll(
        "/create",
        `/${updatedQuest.questId}`
      );
    }
    return location.pathname.replaceAll("/create", `/${newQuest?.questId}`);
  }, [location.pathname, updateIsSuccess, createIsSuccess]);

  useEffect(() => {
    if (createIsSuccess) {
      navigate({
        pathname: "/aut-dashboard/modules/Task",
        search: new URLSearchParams({
          onboardingQuestAddress: plugin.pluginAddress,
          returnUrlLinkName: "Back to quest",
          returnUrl: path,
          questId: (newQuest?.questId || quest.questId).toString()
        }).toString()
      });
    }
    if (updateIsSuccess) {
      navigate(path);
    }
  }, [createIsSuccess, updateIsSuccess]);

  const isDisabled = useMemo(() => {
    return !formState.isValid || Object.keys(formState.dirtyFields).length == 0;
  }, [formState]);

  return (
    <Container
      sx={{ py: "20px", display: "flex", flexDirection: "column" }}
      maxWidth="lg"
      component="form"
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <ErrorDialog
        handleClose={() => createReset()}
        open={createIsError}
        message={createError}
      />
      <ErrorDialog
        handleClose={() => updateReset()}
        open={updateIsError}
        message={updateError}
      />
      <LoadingDialog open={createIsLoading} message="Creating quest..." />
      <LoadingDialog open={updateIsLoading} message="Updating quest..." />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          mb: 4,
          position: "relative",
          mx: "auto",
          width: "100%"
        }}
      >
        <Stack alignItems="center" justifyContent="center">
          {quest?.questId && (
            <Button
              startIcon={<ArrowBackIcon />}
              color="offWhite"
              sx={{
                position: {
                  sm: "absolute"
                },
                left: {
                  sm: "0"
                }
              }}
              to={{
                pathname: searchParams.get("returnUrl"),
                search: searchParams.toString()
              }}
              component={Link}
            >
              {searchParams.get("returnUrlLinkName") || "Back"}
            </Button>
          )}

          <Typography textAlign="center" color="white" variant="h3">
            {quest?.questId
              ? "Editing onboarding quest"
              : "Create a new Onboarding Quest"}
          </Typography>
        </Stack>
      </Box>

      <Stack
        direction="column"
        gap={4}
        sx={{
          margin: "0 auto",
          width: {
            xs: "100%",
            sm: "600px",
            xxl: "800px"
          }
        }}
      >
        <Controller
          name="role"
          control={control}
          rules={{
            validate: {
              selected: (v) => !!v
            }
          }}
          render={({ field: { name, value, onChange } }) => {
            return (
              <AutSelectField
                variant="standard"
                color="offWhite"
                renderValue={(selected) => {
                  if (!selected) {
                    return "Role" as any;
                  }
                  const role = roles.find((t) => t.id === selected);
                  return role?.roleName || selected;
                }}
                name={name}
                value={value || ""}
                displayEmpty
                required
                onChange={onChange}
                helperText={
                  <FormHelperText
                    value={value}
                    name={name}
                    errors={formState.errors}
                  >
                    Select the Role you want to onboard with this Quest
                  </FormHelperText>
                }
              >
                {roles.map((type) => {
                  const questByRole = quests.some((q) => q.role === type.id);
                  return (
                    <MenuItem
                      disabled={!!questByRole}
                      key={`role-${type.id}`}
                      value={type.id}
                    >
                      {type.roleName}
                      {!!questByRole && <> (Quest already created) </>}
                    </MenuItem>
                  );
                })}
              </AutSelectField>
            );
          }}
        />

        {/* @ts-ignore */}
        {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div className="sw-form-field">
            <div className="sw-form-field-content">
              <CalendarPicker
                control={control}
                name="startDate"
                minDate={new Date()}
              />
            </div>
          </div>
        </LocalizationProvider> */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DateTimePicker"]}>
            <DateTimePicker label="Basic date time picker" />
          </DemoContainer>
        </LocalizationProvider>

        {/* <Controller
              name="durationInDays"
              control={control}
              rules={{
                required: true
              }}
              render={({ field: { name, value, onChange } }) => {
                return (
                  <AutTextField
                    name={name}
                    disabled
                    value={value || ""}
                    type="number"
                    onChange={onChange}
                    variant="standard"
                    color="offWhite"
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment
                          sx={{
                            ".MuiTypography-root": {
                              color: "white"
                            }
                          }}
                          position="end"
                        >
                          days
                        </InputAdornment>
                      )
                    }}
                    placeholder="Duration"
                    helperText={
                      <FormHelperText
                        errorTypes={errorTypes}
                        value={value}
                        name={name}
                        errors={formState.errors}
                      >
                        <Tooltip title="During the closed beta, the duration of each onboarding quest will be Xdays and begin on the Xth, until then you can invite your community to allowlist for quests you have activated. During the onboarding period, every community will be listed on the Nova Leaderboard where the number of successful onboardings will correspond to their ranking. Happy Onboarding!">
                          <HelpOutlineIcon
                            // color="white"
                            sx={{
                              color: "white",
                              width: {
                                sm: "16px"
                              }
                            }}
                          />
                        </Tooltip>
                      </FormHelperText>
                    }
                  />
                );
              }}
            /> */}

        {/* <Controller
          name="description"
          control={control}
          rules={{
            required: true,
            maxLength: 257
          }}
          render={({ field: { name, value, onChange } }) => {
            return (
              <AutTextField
                name={name}
                value={value || ""}
                onChange={onChange}
                variant="outlined"
                color="offWhite"
                required
                multiline
                rows={5}
                placeholder="Describe the onboarding quest to your community"
                helperText={
                  <FormHelperText
                    errorTypes={errorTypes}
                    value={value}
                    name={name}
                    errors={formState.errors}
                  />
                }
              />
            );
          }}
        /> */}

        <Typography color="white" variant="body">
          During the closed beta, the duration of each onboarding quest will be
          <Strong> {questDates.durationInDays} days</Strong>, starting on{" "}
          <Strong>{questDates.startDate.toDateString()}</Strong>, until then you
          can invite new community members to take the quests you launched.
          <br />
          During the onboarding period, every community will be listed on the{" "}
          <BtnLink
            component="a"
            type="button"
            color="primary"
            variant="body"
            href={urls.leaderboard}
            target="_blank"
          >
            Nova Leaderboard
          </BtnLink>{" "}
          - their ranking will be determined by the amount of members onboarded.
          Have fun, and Onboard (ir)responsibly 😎
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end"
          }}
        >
          <StepperButton
            label={
              quest?.questId
                ? "Edit Onboarding Quest"
                : "Create Onboarding Quest"
            }
            disabled={isDisabled}
          />
        </Box>
      </Stack>
    </Container>
  );
};

export default memo(CreateQuest);
