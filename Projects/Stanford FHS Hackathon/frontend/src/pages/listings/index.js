import { useEffect, useState } from "react";
import { Table } from "../../components/table";
import axios from "axios";
import Loader from "../../components/loader";
import { useNavigate } from "react-router-dom";

export function Listings() {
  const navigate = useNavigate();

  const navigateToEdit = (id) => {
    navigate(`/listings/${id}/edit`);
  };
  const headers = [
    { name: "Title", key: "title" },
    { name: "Price", key: "price" },
    { name: "Status", key: "status", type: "chip" },
    { name: "Created At", key: "created_at" },
    // {
    //   name: "Actions",
    //   key: "actions",
    //   type: "actions",
    //   actions: [
    //     {
    //       name: "Edit",
    //       icon: "",
    //       onClick: (id) => {
    //         navigateToEdit(id);
    //       },
    //     },
    //   ],
    // }, // For actions like Edit/Delete
  ];

  const [isLoading, setLoading] = useState(false);
  const [listingData, setListingData] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5001/listings/get_my_listings?user_id=${localStorage.getItem("user_id")}`)
      .then((response) => {
        const listings = [];
        response.data.map((listing) => {
          listings.push(listing);
        });
        setListingData(listings);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);
  const nagivateToCreate = () => {
    navigate("/listings/create")
  }
  return (
    <>
      <div className="p-8">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Listings</h1>
          <button onClick={nagivateToCreate} className="min-w-32 bg-primary text-white rounded-lg p-2 flex items-center justify-center gap-2 hover:bg-primary/90">
            <span>Add Listing</span>
          </button>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <div className="mt-8">
            <Table title={"Listings"} headers={headers} rowData={listingData} />
          </div>
        )}
      </div>
    </>
  );
}
