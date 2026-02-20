import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import './App.css';
import Home from './pages/Website/Home';
import "./assets/style.css"

// Lazy loading components
const Login = lazy(() => import('./pages/Login'));
const DashboardLayout = lazy(() => import('./components/DashboardLayout'));
const ViewJournal = lazy(() => import('./pages/ViewJournal'));
const JournalDetails = lazy(() => import('./pages/JournalDetails'));
const ViewJournalIssues = lazy(() => import('./pages/ViewJournalIssues'));
const AddJournalIssue = lazy(() => import('./pages/AddJournalIssue'));
const JournalIssueDetails = lazy(() => import('./pages/JournalIssueDetails'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));
const About = lazy(() => import('./pages/Website/About'));
const ScholarShip = lazy(() => import('./pages/Website/ScholarShip'));
const SubmitYourManuScript = lazy(() => import('./pages/Website/SubmitYourManuScript'));
const TermsAndConditions = lazy(() => import('./pages/Website/TermsAndConditions'));
const BecomeAnEditor = lazy(() => import('./pages/Website/BecomeAnEditor'));
const ForgetPassword = lazy(() => import('./pages/Website/ForgetPassword'));
const WebsiteLayout = lazy(() => import('./components/WebsiteLayout'));
const PrivacyPolicy = lazy(() => import('./pages/Website/PrivacyPolicy'));
const SiteMap = lazy(() => import('./pages/Website/SiteMap'));
const Contact = lazy(() => import('./pages/Website/Contact'));
const OpenAccessAndLicencing = lazy(() => import('./pages/Website/OpenAccessAndLicencing'));
const ImpactFactors = lazy(() => import('./pages/Website/ImpactFactors'));
const EthicalGuidLine = lazy(() => import('./pages/Website/EthicalGuidLine'));
const MeetOurTeam = lazy(() => import('./pages/Website/MeetOurTeam'));
const WhyPublishWithUs = lazy(() => import('./pages/Website/WhyPublishWithUs'));
const BrowseOfJournals = lazy(() => import('./pages/Website/BrowseOfJournals'));
const AuthorGuidlinens = lazy(() => import('./pages/Website/AuthorGuidlinens'));
const ViewCallForPaper = lazy(() => import('./pages/Website/ViewCallForPaper'));
const ArticleProcessingCharges = lazy(() => import('./pages/Website/ArticleProcessingCharges'));
const Resources = lazy(() => import('./pages/Website/Resources'));
const JournalIndexing = lazy(() => import('./pages/Website/JournalIndexing'));
const PublicEthicAndMalPractices = lazy(() => import('./pages/Website/PublicEthicAndMalPractices'));
const Journals = lazy(() => import('./pages/Website/Journals'));
const ThankYou = lazy(() => import('./pages/Website/ThankYou'));
const ConferenceList = lazy(() => import('./pages/Website/ConferenceList')); // Load ConferenceList
const ConferenceSolutionsPage = lazy(() => import('./pages/Website/ConferenceSolutionsPage'));
const ConferenceDetailsPage = lazy(() => import('./pages/Website/ConferenceDetailsPage'));
const AuthorLogin = lazy(() => import('./pages/Website/AuthorLogin'));

const PageNotFound = lazy(() => import('./pages/Website/PageNotFound'));
const AdminUserList = lazy(() => import('./pages/Admin/AdminAuthorList'));
const JournalCategories = lazy(() => import('./pages/Admin/JournalCategories'));
const ManuscriptList = lazy(() => import('./pages/Admin/ManuscriptList'));
const ManuscriptDetails = lazy(() => import('./pages/Admin/ManuscriptDetails'));
const AdminContactList = lazy(() => import('./pages/Admin/AdminContactList'));
const ViewSubmitterPublications = lazy(() => import('./pages/Admin/ViewSubmitterPublications'));
const SubmitterPublicationDetails = lazy(() => import('./pages/Admin/SubmitterPublicationDetails'));
const DashboardHome = lazy(() => import('./pages/DashboardHome'));
const MyManuscriptList = lazy(() => import('./pages/Author/MyManuscriptList'));
const MyManuscriptDetails = lazy(() => import('./pages/Author/MyManuscriptDetails'));
const CopyrightForm = lazy(() => import('./pages/Author/CopyrightForm'));
const AddConference = lazy(() => import('./pages/Admin/AddConference'));
const ConferenceRegistrationList = lazy(() => import('./pages/Admin/ConferenceRegistrationList')); // Re-import
const ConferenceRegistrationDetails = lazy(() => import('./pages/Admin/ConferenceRegistrationDetails'));
const ConferenceTemplateList = lazy(() => import('./pages/Admin/ConferenceTemplateList'));
const AddConferenceTemplate = lazy(() => import('./pages/Admin/AddConferenceTemplate'));
const EditConferenceTemplate = lazy(() => import('./pages/Admin/EditConferenceTemplate'));
const ConferenceTemplateDetails = lazy(() => import('./pages/Admin/ConferenceTemplateDetails'));
const ManageNews = lazy(() => import('./pages/Admin/ManageNews'));
const NewsDetails = lazy(() => import('./pages/Admin/NewsDetails'));
const NewsDetailPage = lazy(() => import('./pages/Website/NewsDetailPage'));
const AllNewsPage = lazy(() => import('./pages/Website/AllNewsPage'));
const AbstractSubmission = lazy(() => import('./pages/Author/AbstractSubmission'));
const AbstractManagement = lazy(() => import('./pages/Admin/AbstractManagement'));
const EditorAbstractReview = lazy(() => import('./pages/Editor/EditorAbstractReview'));
const EditorManuscriptList = lazy(() => import('./pages/Editor/EditorManuscriptList'));
const EditorManuscriptDetails = lazy(() => import('./pages/Editor/EditorManuscriptDetails'));
const FullPaperSubmission = lazy(() => import('./pages/Author/FullPaperSubmission'));
const JournalEditorApplications = lazy(() => import('./pages/Admin/JournalEditorApplications'));
const ManageSubadmins = lazy(() => import('./pages/Admin/ManageSubadmins'));
const ProposalRequestList = lazy(() => import('./pages/Admin/ProposalRequestList'));
const ProposalRequestDetails = lazy(() => import('./pages/Admin/ProposalRequestDetails'));
function App() {
  return (
    <Router>
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route element={<WebsiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthorLogin />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/scholarships" element={<ScholarShip />} />
            <Route path="/submit-manuscript" element={<SubmitYourManuScript />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/become-an-editor" element={<BecomeAnEditor />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/sitemap" element={<SiteMap />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/open-access-and-licencing" element={<OpenAccessAndLicencing />} />
            <Route path="/impact-factor" element={<ImpactFactors />} />
            <Route path="/ethical-guidelines" element={<EthicalGuidLine />} />
            <Route path="/meet-our-team" element={<MeetOurTeam />} />
            <Route path="/why-publish-with-us" element={<WhyPublishWithUs />} />
            <Route path="/browse-journals" element={<BrowseOfJournals />} />
            <Route path="/authors-guidelines" element={<AuthorGuidlinens />} />
            <Route path="/view-call-for-papers" element={<ViewCallForPaper />} />
            <Route path="/article-processing-charges" element={<ArticleProcessingCharges />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/journal-indexing" element={<JournalIndexing />} />
            <Route path="/publication-ethics-and-malpractice-statement" element={<PublicEthicAndMalPractices />} />
            <Route path="/journals/:route" element={<Journals />} />
            <Route path="/thank-you" element={<ThankYou />} />
            {/* <Route path="/news" element={<AllNewsPage />} /> */}
            {/* <Route path="/news/:id" element={<NewsDetailPage />} /> */}
            <Route path="/upcoming-conferences" element={<ConferenceList type="upcoming" />} />
            <Route path="/previous-conferences" element={<ConferenceList type="previous" />} />

            <Route path="/conferences" element={<ConferenceSolutionsPage />} />
            {/* 404 Page (within layout) */}
            <Route path="*" element={<PageNotFound />} />
          </Route>

          {/* Standalone Route for Conference Details (No WebsiteLayout) */}
          <Route path="/:conferenceSlug/:encryptedId" element={<ConferenceDetailsPage />} />

          <Route element={<PublicRoute />}>
            <Route path="/admin/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="view-journal" element={<ViewJournal />} />
              <Route path="view-journal/:id" element={<JournalDetails />} />
              <Route path="journal-editor-applications/:journalId" element={<JournalEditorApplications />} />
              <Route path="journal-issues" element={<ViewJournalIssues />} />
              <Route path="journal-issues/add" element={<AddJournalIssue />} />
              <Route path="journal-issues/:id" element={<JournalIssueDetails />} />

              <Route path="manage-users" element={<AdminUserList />} />
              <Route path="manage-subadmins" element={<ManageSubadmins />} />
              <Route path="journal-categories" element={<JournalCategories />} />

              <Route path="manuscripts" element={<ManuscriptList />} />
              <Route path="manuscripts/:id" element={<ManuscriptDetails />} />
              <Route path="manuscripts/:id/copyright" element={<CopyrightForm viewOnly={true} />} />
              <Route path="contact-us" element={<AdminContactList />} />
              <Route path="proposal-requests" element={<ProposalRequestList />} />
              <Route path="proposal-requests/:id" element={<ProposalRequestDetails />} />
              <Route path="add-conference" element={<AddConference />} />
              <Route path="view-submitter-publications" element={<ViewSubmitterPublications />} />
              <Route path="view-submitter-publications/:id" element={<SubmitterPublicationDetails />} />
              <Route path="submit-manuscript" element={<MyManuscriptList />} />
              <Route path="submit-manuscript/new" element={<SubmitYourManuScript isDashboard={true} />} />
              <Route path="submit-manuscript/:id" element={<MyManuscriptDetails />} />
              <Route path="submit-manuscript/:id/copyright" element={<CopyrightForm />} />

              <Route path="conference-templates" element={<ConferenceTemplateList />} />
              <Route path="add-conference-template" element={<AddConferenceTemplate />} />
              <Route path="conference-templates/edit/:id" element={<EditConferenceTemplate />} />
              <Route path="conference-templates/:id" element={<ConferenceTemplateDetails />} />
              <Route path="conference-registrations" element={<ConferenceRegistrationList />} />
              <Route path="conference-registrations/:id" element={<ConferenceRegistrationDetails />} />
              <Route path="conference/abstract-submission" element={<AbstractSubmission />} />
              <Route path="conference/full-paper-submission" element={<FullPaperSubmission />} />
              <Route path="conference/abstract-management" element={<AbstractManagement />} />

              {/* Editor Routes */}
              <Route path="editor/review-abstracts" element={<EditorAbstractReview />} />
              <Route path="editor/manuscripts" element={<EditorManuscriptList />} />
              <Route path="editor/manuscripts/:id" element={<EditorManuscriptDetails />} />
              <Route path="editor/manuscripts/:id/copyright" element={<CopyrightForm viewOnly={true} />} />
            </Route>
          </Route>

          {/* Default Redirect (Login) - redundant if catch-all is above, but keeping for logic separation if needed or specific redirects */}
          {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
