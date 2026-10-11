import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Container, Typography, Grid, Card, CardContent, Stack, Chip, Button, Alert, CircularProgress, Divider, } from "@mui/material";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import { getMyApplications, cancelAdoption, } from "../../services/adoptionService";
import { createAdoptionFeeOrder, verifyAdoptionFeePayment, getAdoptionPaymentStatus, } from "../../services/paymentService";
const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [paymentStatuses, setPaymentStatuses] = useState({});
    const [loading, setLoading] = useState(true);
    const [paymentLoadingId, setPaymentLoadingId] = useState(null);
    const [cancellingId, setCancellingId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };
    const fetchPaymentStatus = async (applicationId) => {
        try {
            const data = await getAdoptionPaymentStatus(applicationId);
            setPaymentStatuses((current) => ({
                ...current,
                [applicationId]: data,
            }));
        }
        catch (error) {
            console.error("Failed to load payment status:", error);
        }
    };
    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getMyApplications();
            const applicationList = data.applications || [];
            setApplications(applicationList);
            const paymentRelevantApplications = applicationList.filter((application) => application.pet &&
                ["approved", "completed"].includes(application.status));
            await Promise.all(paymentRelevantApplications.map((application) => fetchPaymentStatus(application._id)));
        }
        catch (error) {
            setError(error.response?.data?.message ||
                "Failed to load your adoption applications.");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchApplications();
    }, []);
    const getApplicationAppearance = (status) => {
        switch (status) {
            case "approved":
                return {
                    label: "Approved",
                    color: "#246A52",
                    background: "#E0F2E8",
                    icon: <CheckCircleRoundedIcon />,
                };
            case "rejected":
                return {
                    label: "Rejected",
                    color: "#BE5555",
                    background: "#FCE9E7",
                    icon: <CancelRoundedIcon />,
                };
            case "completed":
                return {
                    label: "Completed",
                    color: "#367F98",
                    background: "#E4F1F6",
                    icon: <FavoriteRoundedIcon />,
                };
            default:
                return {
                    label: "Pending",
                    color: "#99651E",
                    background: "#FFF0DC",
                    icon: <HourglassTopRoundedIcon />,
                };
        }
    };
    const getPetStatusLabel = (status) => {
        if (status === "pending") {
            return "Reserved";
        }
        if (!status) {
            return "Unavailable";
        }
        return status.charAt(0).toUpperCase() + status.slice(1);
    };
    const getPetStatusAppearance = (status) => {
        if (status === "available") {
            return {
                color: "#246A52",
                background: "#E2F3E9",
            };
        }
        if (status === "pending") {
            return {
                color: "#99651E",
                background: "#FFF0DC",
            };
        }
        if (status === "adopted") {
            return {
                color: "#367F98",
                background: "#E4F1F6",
            };
        }
        return {
            color: "#60746D",
            background: "#EDF2EF",
        };
    };
    const formatDate = (date) => {
        if (!date) {
            return "Date unavailable";
        }
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };
    const handleCancel = async (applicationId) => {
        const confirmed = window.confirm("Are you sure you want to cancel this adoption application?");
        if (!confirmed) {
            return;
        }
        try {
            setCancellingId(applicationId);
            setError("");
            setSuccess("");
            await cancelAdoption(applicationId);
            setApplications((currentApplications) => currentApplications.filter((application) => application._id !== applicationId));
            setSuccess("Your adoption application was cancelled successfully.");
        }
        catch (error) {
            setError(error.response?.data?.message ||
                "Failed to cancel adoption application.");
        }
        finally {
            setCancellingId(null);
        }
    };
    const handlePayment = async (application) => {
        try {
            setPaymentLoadingId(application._id);
            setError("");
            setSuccess("");
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                setError("Unable to load Razorpay. Please check your internet connection and try again.");
                setPaymentLoadingId(null);
                return;
            }
            const orderData = await createAdoptionFeeOrder(application._id);
            if (!orderData.paymentRequired) {
                await fetchPaymentStatus(application._id);
                setSuccess("No adoption fee is required for this pet.");
                setPaymentLoadingId(null);
                return;
            }
            const user = JSON.parse(localStorage.getItem("user"));
            const options = {
                key: orderData.keyId,
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: "PawBuddy",
                description: `Adoption fee for ${application.pet?.name || "pet adoption"}`,
                order_id: orderData.order.id,
                handler: async (response) => {
                    try {
                        setPaymentLoadingId(application._id);
                        await verifyAdoptionFeePayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        await fetchPaymentStatus(application._id);
                        setSuccess(`Adoption fee for ${application.pet?.name || "your pet"} was paid successfully.`);
                    }
                    catch (error) {
                        setError(error.response?.data?.message || "Payment verification failed.");
                    }
                    finally {
                        setPaymentLoadingId(null);
                    }
                },
                prefill: {
                    name: user?.name || "",
                    email: user?.email || "",
                },
                theme: {
                    color: "#2F7D6D",
                },
                modal: {
                    ondismiss: () => {
                        setPaymentLoadingId(null);
                    },
                },
            };
            const razorpay = new window.Razorpay(options);
            razorpay.on("payment.failed", (response) => {
                setError(response.error?.description || "Payment failed. Please try again.");
                setPaymentLoadingId(null);
            });
            razorpay.open();
        }
        catch (error) {
            setError(error.response?.data?.message || "Failed to start payment.");
            setPaymentLoadingId(null);
        }
    };
    return (<Box sx={{
            minHeight: "calc(100vh - 78px)",
            backgroundColor: "background.default",
            pb: { xs: 8, md: 12 },
        }}>

      <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 } }}>

        {/* Page Header */}

        <Box sx={{
            position: "relative",
            overflow: "hidden",
            p: {
                xs: 3,
                sm: 4,
                md: 5,
            },
            borderRadius: {
                xs: "22px",
                md: "28px",
            },
            background: "linear-gradient(120deg, #E8F5EE 0%, #F7FBF8 55%, #FFF4EC 100%)",
            border: "1px solid #DDEBE3",
            mb: 4,
        }}>

          <AssignmentRoundedIcon aria-hidden="true" sx={{
            position: "absolute",
            right: { xs: -35, md: 35 },
            top: -45,
            fontSize: { xs: 155, md: 220 },
            color: "rgba(47,125,109,0.065)",
            transform: "rotate(-15deg)",
            pointerEvents: "none",
        }}/>

          <Box sx={{
            position: "relative",
            zIndex: 1,
            maxWidth: 650,
        }}>

            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>

              <PetsRoundedIcon sx={{
            fontSize: 19,
            color: "primary.main",
        }}/>

              <Typography variant="overline" sx={{
            fontWeight: 800,
            letterSpacing: "0.12em",
            color: "primary.main",
        }}>

                YOUR ADOPTION JOURNEY

              </Typography>

            </Stack>

            <Typography component="h1" sx={{
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: 1.15,
            color: "text.primary",
            fontSize: {
                xs: "2.1rem",
                sm: "2.7rem",
                md: "3.1rem",
            },
            mb: 2,
        }}>

              My Adoption{" "}

              <Box component="span" sx={{ color: "primary.main" }}>

                Applications

              </Box>

            </Typography>

            <Typography color="text.secondary" sx={{
            maxWidth: 550,
            lineHeight: 1.8,
        }}>

              Follow the progress of your applications, complete any required

              payments, and get one step closer to welcoming your new companion.

            </Typography>

          </Box>

        </Box>

        {/* Messages */}

        {error && (<Alert severity="error" sx={{ mb: 3 }}>

            {error}

          </Alert>)}

        {success && (<Alert severity="success" sx={{ mb: 3 }}>

            {success}

          </Alert>)}

        {loading ? (<Stack alignItems="center" justifyContent="center" spacing={2} sx={{
                minHeight: 330,
            }}>

            <CircularProgress />

            <Typography variant="body2" color="text.secondary">

              Loading your adoption journey...

            </Typography>

          </Stack>) : (<>

            {/* Applications Heading */}

            <Stack direction={{
                xs: "column",
                sm: "row",
            }} justifyContent="space-between" alignItems={{
                xs: "flex-start",
                sm: "center",
            }} spacing={1.5} sx={{ mb: 3 }}>

              <Box>

                <Typography variant="h5" sx={{
                fontWeight: 800,
                mb: 0.5,
            }}>

                  Your Applications

                </Typography>

                <Typography variant="body2" color="text.secondary">

                  Every adoption journey starts with a little hope.

                </Typography>

              </Box>

              <Chip label={`${applications.length} ${applications.length === 1 ? "application" : "applications"}`} sx={{
                backgroundColor: "#E6F3EC",
                color: "#2F7D6D",
                fontWeight: 750,
            }}/>

            </Stack>

            {/* Application Cards */}

            <Grid container spacing={3}>

              {applications.map((application) => {
                const pet = application.pet;
                const paymentStatus = paymentStatuses[application._id];
                const paymentRequired = pet?.adoptionFee > 0;
                const isPaid = paymentStatus?.paid === true;
                const appearance = getApplicationAppearance(application.status);
                const petAppearance = getPetStatusAppearance(pet?.status);
                return (<Grid key={application._id} size={{
                        xs: 12,
                        md: 6,
                    }}>

                    <Card sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "22px",
                        border: "1px solid #E2ECE6",
                        overflow: "hidden",
                        boxShadow: "0 7px 24px rgba(39,81,62,0.06)",
                        transition: "transform 0.25s ease, box-shadow 0.25s ease",
                        "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: "0 13px 30px rgba(39,81,62,0.10)",
                        },
                    }}>

                      {/* Pet Image */}

                      <Box sx={{
                        position: "relative",
                        height: 225,
                        overflow: "hidden",
                        backgroundColor: "#EAF4F0",
                    }}>

                        {pet?.image ? (<Box component="img" src={`/uploads/${pet.image}`} alt={pet.name} loading="lazy" sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}/>) : (<Stack alignItems="center" justifyContent="center" spacing={1} sx={{
                            height: "100%",
                        }}>

                            <PetsRoundedIcon sx={{
                            fontSize: 60,
                            color: "#A3CBB9",
                        }}/>

                            <Typography variant="body2" color="text.secondary">

                              No Image Available

                            </Typography>

                          </Stack>)}

                        <Chip icon={appearance.icon} label={appearance.label} size="small" sx={{
                        position: "absolute",
                        top: 16,
                        left: 16,
                        height: 32,
                        px: 0.5,
                        fontWeight: 750,
                        backgroundColor: appearance.background,
                        color: appearance.color,
                        boxShadow: "0 3px 12px rgba(0,0,0,0.07)",
                        "& .MuiChip-icon": {
                            color: "inherit",
                            fontSize: 17,
                        },
                    }}/>

                      </Box>

                      <CardContent sx={{
                        p: { xs: 2.5, sm: 3 },
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                        "&:last-child": {
                            pb: { xs: 2.5, sm: 3 },
                        },
                    }}>

                        {/* Pet Name and Date */}

                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ mb: 2 }}>

                          <Box sx={{ minWidth: 0 }}>

                            <Typography variant="h6" sx={{
                        color: "text.primary",
                        fontWeight: 800,
                        mb: 0.5,
                    }}>

                              {pet?.name || "Pet unavailable"}

                            </Typography>

                            {pet && (<Typography variant="body2" color="text.secondary">

                                {pet.species}

                                {" · "}

                                {pet.breed || "Mixed breed"}

                              </Typography>)}

                          </Box>

                          <Stack direction="row" alignItems="center" spacing={0.5} sx={{
                        color: "text.secondary",
                        flexShrink: 0,
                    }}>

                            <CalendarMonthRoundedIcon sx={{ fontSize: 16 }}/>

                            <Typography variant="caption" sx={{ fontWeight: 600 }}>

                              {formatDate(application.createdAt)}

                            </Typography>

                          </Stack>

                        </Stack>

                        <Divider sx={{ mb: 2.5 }}/>

                        {/* Pet Information */}

                        {pet ? (<Grid container spacing={1.5} sx={{ mb: 2.5 }}>

                            <Grid size={{ xs: 6 }}>

                              <Box sx={{
                            height: "100%",
                            p: 2,
                            borderRadius: "13px",
                            backgroundColor: "#F7FAF9",
                            border: "1px solid #EAF0EC",
                        }}>

                                <Typography variant="caption" color="text.secondary" sx={{
                            display: "block",
                            mb: 1,
                            fontWeight: 600,
                        }}>

                                  Pet Status

                                </Typography>

                                <Chip label={getPetStatusLabel(pet.status)} size="small" sx={{
                            backgroundColor: petAppearance.background,
                            color: petAppearance.color,
                            fontWeight: 750,
                        }}/>

                              </Box>

                            </Grid>

                            <Grid size={{ xs: 6 }}>

                              <Box sx={{
                            height: "100%",
                            p: 2,
                            borderRadius: "13px",
                            backgroundColor: "#F7FAF9",
                            border: "1px solid #EAF0EC",
                        }}>

                                <Typography variant="caption" color="text.secondary" sx={{
                            display: "block",
                            mb: 0.7,
                            fontWeight: 600,
                        }}>

                                  Adoption Fee

                                </Typography>

                                <Typography variant="body1" sx={{
                            fontWeight: 800,
                            color: "primary.main",
                        }}>

                                  {pet.adoptionFee === 0
                            ? "Free"
                            : `₹${Number(pet.adoptionFee).toLocaleString("en-IN")}`}

                                </Typography>

                              </Box>

                            </Grid>

                          </Grid>) : (<Alert severity="warning" sx={{ mb: 2.5 }}>

                            This pet is no longer available in the pet list.

                          </Alert>)}

                        {/* Application Message */}

                        {application.message && (<Box sx={{
                            p: 2.25,
                            mb: 2.5,
                            borderRadius: "14px",
                            backgroundColor: "#F5F9F7",
                            border: "1px solid #E5EFE9",
                        }}>

                            <Typography variant="subtitle2" sx={{
                            fontWeight: 800,
                            mb: 0.8,
                        }}>

                              Your Message

                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{
                            lineHeight: 1.8,
                            whiteSpace: "pre-wrap",
                        }}>

                              {application.message}

                            </Typography>

                          </Box>)}

                        {/* Application Progress */}

                        {application.status === "pending" && (<Box sx={{
                            p: 2.25,
                            borderRadius: "14px",
                            backgroundColor: "#FFF8ED",
                            border: "1px solid #F3E4CA",
                        }}>

                            <Stack direction="row" alignItems="flex-start" spacing={1.3}>

                              <HourglassTopRoundedIcon sx={{
                            color: "#B17A35",
                            fontSize: 22,
                            mt: 0.2,
                        }}/>

                              <Box>

                                <Typography variant="subtitle2" sx={{
                            fontWeight: 800,
                            color: "#865B22",
                            mb: 0.5,
                        }}>

                                  Application Submitted

                                </Typography>

                                <Typography variant="body2" sx={{
                            lineHeight: 1.75,
                            color: "#896D47",
                        }}>

                                  Your application is waiting for a decision

                                  from the shelter.

                                </Typography>

                              </Box>

                            </Stack>

                          </Box>)}

                        {application.status === "approved" && (<>

                            <Alert severity="success" icon={<CheckCircleRoundedIcon />} sx={{
                            mb: 2.5,
                            border: "1px solid #D6EBDE",
                        }}>

                              <Typography variant="subtitle2" sx={{
                            fontWeight: 800,
                            mb: 0.4,
                        }}>

                                Application Approved!

                              </Typography>

                              <Typography variant="body2" sx={{ lineHeight: 1.7 }}>

                                Your adoption application has been approved.

                                {pet?.status === "pending" &&
                            ` ${pet.name} is now reserved for you.`}

                              </Typography>

                            </Alert>

                            {pet && (<Box sx={{
                                p: 2.5,
                                mb: 1,
                                borderRadius: "16px",
                                backgroundColor: "#EFF7F2",
                                border: "1px solid #D9EAE0",
                            }}>

                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>

                                  <PaymentsRoundedIcon sx={{
                                fontSize: 22,
                                color: "primary.main",
                            }}/>

                                  <Typography variant="subtitle1" sx={{
                                fontWeight: 800,
                            }}>

                                    Adoption Fee

                                  </Typography>

                                </Stack>

                                {!paymentRequired ? (<Alert severity="info">

                                    This pet has no adoption fee. No payment is

                                    required.

                                  </Alert>) : isPaid ? (<Alert severity="success">

                                    Adoption fee of ₹

                                    {Number(pet.adoptionFee).toLocaleString("en-IN")}{" "}

                                    has been paid successfully.

                                  </Alert>) : (<Stack spacing={1.8}>

                                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>

                                      <Typography variant="body2" color="text.secondary">

                                        Amount to pay

                                      </Typography>

                                      <Typography variant="h6" sx={{
                                    color: "primary.main",
                                    fontWeight: 800,
                                }}>

                                        ₹

                                        {Number(pet.adoptionFee).toLocaleString("en-IN")}

                                      </Typography>

                                    </Stack>

                                    <Button variant="contained" fullWidth startIcon={<PaymentsRoundedIcon />} disabled={paymentLoadingId === application._id} onClick={() => handlePayment(application)} sx={{
                                    py: 1.25,
                                    borderRadius: "11px",
                                    fontWeight: 800,
                                }}>

                                      {paymentLoadingId === application._id
                                    ? "Starting Payment..."
                                    : `Pay ₹${Number(pet.adoptionFee).toLocaleString("en-IN")}`}

                                    </Button>

                                  </Stack>)}

                              </Box>)}

                          </>)}

                        {application.status === "rejected" && (<Alert severity="error" icon={<CancelRoundedIcon />} sx={{
                            border: "1px solid #F4DAD9",
                        }}>

                            This adoption application was rejected.

                          </Alert>)}

                        {application.status === "completed" && (<Alert severity="info" icon={<FavoriteRoundedIcon />} sx={{
                            border: "1px solid #D5E8EF",
                        }}>

                            <Typography variant="subtitle2" sx={{
                            fontWeight: 800,
                            mb: 0.4,
                        }}>

                              Adoption Completed

                            </Typography>

                            Your adoption has been completed successfully.

                          </Alert>)}

                        {/* Card Actions */}

                        <Box sx={{
                        mt: "auto",
                        pt: 3,
                    }}>

                          {pet && (<Button component={Link} to={`/pets/${pet._id}`} variant="outlined" fullWidth endIcon={<ArrowForwardRoundedIcon />} sx={{
                            py: 1.2,
                            fontWeight: 750,
                            borderRadius: "11px",
                        }}>

                              View Pet Details

                            </Button>)}

                          {application.status === "pending" && (<Button variant="text" color="error" fullWidth disabled={cancellingId === application._id} onClick={() => handleCancel(application._id)} sx={{
                            mt: 1.5,
                            py: 1.1,
                            fontWeight: 700,
                        }}>

                              {cancellingId === application._id
                            ? "Cancelling..."
                            : "Cancel Application"}

                            </Button>)}

                        </Box>

                      </CardContent>

                    </Card>

                  </Grid>);
            })}

              {/* Empty State */}

              {applications.length === 0 && (<Grid size={{ xs: 12 }}>

                  <Box sx={{
                    py: {
                        xs: 7,
                        md: 9,
                    },
                    px: 3,
                    textAlign: "center",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "22px",
                    border: "1px dashed #C7DCD1",
                }}>

                    <Box sx={{
                    width: 82,
                    height: 82,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2.5,
                    borderRadius: "24px",
                    backgroundColor: "#E4F3EB",
                }}>

                      <PetsRoundedIcon sx={{
                    fontSize: 44,
                    color: "primary.main",
                }}/>

                    </Box>

                    <Typography variant="h5" sx={{
                    fontWeight: 800,
                    mb: 1.5,
                }}>

                      Your journey starts here

                    </Typography>

                    <Typography color="text.secondary" sx={{
                    maxWidth: 440,
                    mx: "auto",
                    lineHeight: 1.8,
                    mb: 3,
                }}>

                      You haven't submitted any adoption applications yet.

                      Explore the pets waiting for a loving home.

                    </Typography>

                    <Button component={Link} to="/pets" variant="contained" endIcon={<ArrowForwardRoundedIcon />} sx={{
                    px: 3,
                    py: 1.3,
                    borderRadius: "11px",
                }}>

                      Explore Available Pets

                    </Button>

                  </Box>

                </Grid>)}

            </Grid>

          </>)}

      </Container>

    </Box>);
};
export default MyApplications;
