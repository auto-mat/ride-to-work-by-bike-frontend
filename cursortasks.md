# Implement a new banner BannerTeamMemberApprove.vue

Please help me implement a new banner for my app which will show user the information about:

1. waiting for being approved as a team member
2. other members wanting to be approved as team members

## Specification

---

Step 1:

This banner will have 2 variants depending on state ("approved" or "undecided") + number of members waiting for approval. Draw as much as possible from `BannerRoutes.vue` template. The component should have the same layout and styles for image button and text. Do not copy over any logic data or props, such as routesCount or variant.

If current user is undecided, banner will show:

- image
- text message (translation key: bannerTeamMemberApprove.textWaitingForApproval)

If current user is approved AND there are other members waiting for approval banner will show:

- image
- text message (translation key: bannerTeamMemberApprove.textMembersWaitingForApproval)
- button (translation key: bannerTeamMemberApprove.buttonApproveMembers)

When clicking on the button, the banner will open a modal with a list of members waiting for approval.
The component will use An existing component `DialogDefault.vue`. See for reference how it is used in `DetailsItem.vue` component.
The content of the model will be a form with a list of members waiting for approval. The form will have a UI that allows to decide if user wants to approve or reject the member. Think carefully about the correct way to implement the selection - Approve reject or leave as it is. Once the user defines which members they want to approve or reject, they can hit save button to submit the form. The form will also have a cancel button to close the model without saving changes.

If current user is approved AND there are no other members waiting for approval banner will not be shown.

---

Step 2:

Banner team member approve will be shown on IndexPage and on ProfilePage pages. These pages should have onMounted hook which will load data from my_team endpoint via useApiGetMyTeam if this data is not already available in store.

In BannerTeamMembers approve, we will load the data via getMyTeam getter - this will have type MyTeamResults. The important data for our implementation is:

- member_count
- unapproved_member_count
- is_full
- members

Member count is approved member count. Is full says if the number of approved members has reached the limit - in that case, user is not able to add more members. Members hold information about all members in the team including the current user.
Each member has field is_me which can be used on identify current user status.
Each member has field approved_for_team which can be used to identify if the member is approved for the team already. Type is TeamMemberStatus enum from `TeamMember.ts` file.

This is an example data of the single item in members array:

```
{
  "distance": 0.0,
  "emissions": {
      "co2": 0.0,
      "co": 0.0,
      "nox": 0.0,
      "n2o": 0.0,
      "voc": 0.0,
      "ch4": 0.0,
      "so2": 0.0,
      "solid": 0.0,
      "pb": 0.0
  },
  "working_rides_base_count": 1284,
  "id": 49412,
  "name": "Bar Baz",
  "frequency": 0.0,
  "avatar_url": "",
  "eco_trip_count": 0,
  "approved_for_team": "approved",
  "rest_url": "https://test.dopracenakole.net/rest/all_userattendance/49412/",
  "is_me": false
}
```

Based on the above data. Implement logic which lists "undecided" members in the modal and offers to approve or reject them. If the team is already full, do not show the banner.

---

Step 3:

Implement useApiPutMyTeam - this is an endpoint to update the team member status.
The logic will be stored in a Composable file `useApiPutMyTeam.ts`, and it will closely mirror useApiGetMyTeam.ts file. URL endpoint is the same. What changes is only the method and the payload. Uses Accept-version: v2.

Example payload:

```
{
  "members": [
    {
      "id": 27,
      "approved_for_team": "approved"
    },
    {
      "id": 78,
      "approved_for_team": "denied"
    },
    {
      "id": 39,
      "approved_for_team": "approved"
    }
  ]
}
```

Assume that the response is the same as in useApiGetMyTeam.ts file.

Generate Test commands interceptMyTeamPutApi and waitForMyTeamPutApi in commands.js file. They will closely mirror interceptMyTeamGetApi and waitForMyTeamGetApi.

---

Step 4:

Implement logic to update the team member status in BannerTeamMemberApprove.vue component.
Depending on the number of members already approved and the max number of members allowed, the form allows to select X members to approve where X = max_members - member_count. Once the user reaches the number X of members to approve, all other members will be selected as rejected and the rejected members' buttons will be disabled. This is to signal that in order to allow for different members, user needs to reject some members first.
After the user makes the selection and clicks the save button, the form will be submitted to the server using useApiPutMyTeam composable.

---

Step 5:

Write component tests for BannerTeamMemberApprove.vue component in BannerTeamMemberApprove.cy.js file.
Behavior to test (based on this specification and current implementation):

- [x] Test that component is rendered correctly with correct data, a modal is opened when button clicked with a list of members to approve with names and buttons to approve or reject members.
- [x] Test that a green button is shown when member is approved and a red button when member is denied.
- [x] Test that after approving 4 members, the 5th member is rejected automatically and the button is disabled.

---

Step 6:

Write end to end tests for pages IndexPage and ProfilePage These can be found in home.spec.cy.js and profile.spec.cy.js respectively.

## Implementation steps

- [x] Update `BannerTeamMemberApprove.vue` component template.
- [x] Skip adding translation keys.
- [x] Add `DialogDefault.vue` component to show the modal and bind the button click to open the modal.
- [x] Add the form markup to the modal.
- [x] Run loadMyTeamToStore (if data is not available in store) on homepage and on profile page.
- [x] Implement types for the member item in the members array, work with `Results.ts` file, do not change current types.
- [x] Implement logic to check if the current user is approved or not.
- [x] Implement logic to check if there are other members waiting for approval.
- [x] Implement logic to check if the team is full.
- [x] Create an array of members which are undecided and use it to render the modal.
- [x] Implement useApiPutMyTeam composable.
- [x] Add commands interceptMyTeamPutApi and waitForMyTeamPutApi in commands.js file.
- [ ] Implement logic to update the team member status in BannerTeamMemberApprove.vue component.
