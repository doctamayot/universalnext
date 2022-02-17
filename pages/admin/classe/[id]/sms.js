import Swal from 'sweetalert2';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext, useReducer, useState } from 'react';

const sms = ({ params }) => {
  console.log(params);
  return <div>sms</div>;
};

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(sms), { ssr: false });
