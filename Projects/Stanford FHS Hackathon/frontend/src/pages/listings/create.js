import { useNavigate } from "react-router-dom";
import { FileUpload } from "../../components/file_upload";
import { SecondaryBtn } from "../../components/secondary_btn";
import SellerWorkflow from "../workflows/seller_workflow";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import { toast } from "react-toastify";
import { sleep } from "../../App";
import FileInput from "../../components/file_input";

export function CreateListing() {
  /*
    Status: 
      1. to_be_initiated
      2. success
      3. error
      4. loading
    Steps: 
      1. to_be_initiated
      2. notify_fsh
      3. prepare_home
      4. upload_photo
      5. create_listing
  */
  const [formSubmitStep, setFormSubmitStep] = useState({ step: "to_be_initiated", stauts: "to_be_initiated" });
  const [submittedFormData, setSubmittedFormData] = useState();

  // listings/notify_fsh
  // listings/prepare_home
  // listings/upload_photo
  // listings/create_listing

  const onSubmit = async (event) => {
    event.preventDefault();

    const formElements = event.target.elements;
    const formValues = {};

    for (let element of formElements) {
      if (element.name === "photo" || element.name === "document") {
        formValues[element.name] = element.files[0];
      } else {
        console.log({ name: element.name, val: element.value });
        formValues[element.name] = element.value;
      }
    }
    console.log(formValues);
    setSubmittedFormData((p) => formValues);
    // callNotifyFsh({ document: formValues.document, user_id: localStorage.getItem("user_id") });
    callCreateApi({ ...formValues, user_id: localStorage.getItem("user_id") });
  };
  const navigate = useNavigate();
  const callNotifyFsh = (data) => {
    const formData = new FormData();
    formData.append("document", data.document);
    formData.append("user_id", localStorage.getItem("user_id"));

    setFormSubmitStep({ step: "notify_fsh", status: "loading" });

    axios
      .post("http://localhost:5001/listings/notify_fsh", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setFormSubmitStep({ step: "notify_fsh", status: "success" });
      })
      .catch((error) => {
        setFormSubmitStep({ step: "notify_fsh", status: "error" });
      });
  };

  const callPrepareHome = () => {
    setFormSubmitStep({ step: "prepare_home", status: "loading" });

    axios
      .post(
        "http://localhost:5001/listings/prepare_home",
        {
          user_id: localStorage.getItem("user_id"),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setFormSubmitStep({ step: "prepare_home", status: "success" });
      })
      .catch((error) => {
        setFormSubmitStep({ step: "prepare_home", status: "error" });
      });
  };

  const callUploadPhoto = (data) => {
    setFormSubmitStep({ step: "upload_photo", status: "loading" });

    axios
      .post("http://localhost:5001/listings/upload_photo", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setFormSubmitStep({ step: "upload_photo", status: "success" });
      })
      .catch((error) => {
        setFormSubmitStep({ step: "upload_photo", status: "error" });
      });
  };

  const callCreateApi = (data) => {
    setFormSubmitStep({ step: "create_listing", status: "loading" });
    sleep(1000).then(() => {
      axios
        .post("http://localhost:5001/listings/create_listing", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setFormSubmitStep({ step: "create_listing", status: "success" });
        })
        .catch((error) => {
          setFormSubmitStep({ step: "create_listing", status: "error" });
        });
    });
  };

  useEffect(() => {
    const { status, step } = formSubmitStep;

    if (status === "success") {
      switch (step) {
        case "notify_fsh":
          callPrepareHome(submittedFormData)
          // callPrepareHome(submittedFormData)
          break;
        case "prepare_home":
          callUploadPhoto({ photo: submittedFormData.photo, user_id: localStorage.getItem("user_id") });
          // callUploadPhoto({ photo: submittedFormData.photo, user_id: localStorage.getItem("user_id") });
          break;
        case "upload_photo":
          toast.success("Successfully created a listing");
          navigate("/listings");
          
          break;
        case "create_listing":
          callNotifyFsh(submittedFormData);

          break;
        default:
          break;
      }
    }

    if (status === "error") {
      toast.error("Error occurred at step: " + step);
    }
  }, [formSubmitStep]);

  return (
    <div className="p-8">
      <form onSubmit={onSubmit}>
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Listing</h1>
          <div className="flex gap-2">
            <SecondaryBtn title={"Cancel"} onClick={() => navigate("/listings")} />
            <button
              type="submit"
              disabled={formSubmitStep.stauts === "loading"}
              className="min-w-32 bg-primary text-white rounded-lg p-2 flex items-center justify-center gap-2 hover:bg-primary/90"
            >
              {formSubmitStep.stauts === "loading" ? <Loader /> : <span>Save</span>}
            </button>
          </div>
        </div>

        {/*  */}
        <div class="sm:col-span-3 m-2">
          <label for="first-name" class="block text-lg text-white font-medium text-gray-900">
            Title
          </label>
          <div class="mt-2">
            <input
              type="text"
              required
              name="title"
              id="first-name"
              autocomplete="given-name"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>
        {/*  */}
        <div class="col-span-full m-2">
          <label for="about" class="block text-lg text-white font-medium text-gray-900">
            Description
          </label>
          <div class="mt-2">
            <textarea
              name="description"
              required
              id="description"
              rows="3"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            ></textarea>
          </div>
          <p class="mt-3 text-sm/6 text-white">Write a few sentences about your property.</p>
        </div>
        {/*  */}
        <div className="text-white">
          <FileInput />
          <FileUpload />
        </div>
        {/*  */}
        <div className="flex flex-row justify-between">
          <div class="w-full sm:col-span-3 m-2">
            <label for="first-name" class="block text-lg text-white font-medium text-gray-900">
              Address
            </label>
            <div class="mt-2">
              <input
                type="text"
                required
                name="address"
                id="first-name"
                autocomplete="given-name"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
          {/*  */}
          <div class="w-full sm:col-span-3 m-2">
            <label for="first-name" class="block text-lg text-white font-medium text-gray-900">
              Price
            </label>
            <div class="mt-2">
              <input
                type="text"
                required
                name="price"
                id="price"
                autocomplete="given-name"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
  // return <SellerWorkflow />
}
