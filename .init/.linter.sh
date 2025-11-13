#!/bin/bash
cd /home/kavia/workspace/code-generation/admin-dashboard-for-user-management-and-authentication-514/fido2_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

