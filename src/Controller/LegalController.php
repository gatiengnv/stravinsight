<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class LegalController extends AbstractController
{
    #[Route('/terms-of-use', name: 'app_terms_of_use')]
    public function index(): Response
    {
        return $this->render('legal/index.html.twig', [
            'title' => 'Terms of Use',
            'text' => '
                <h2>Terms of Use for StravInsight</h2>
                <p>Last Updated: '.date('F d, Y').'</p>

                <h3>1. Acceptance of Terms</h3>
                <p>Welcome to StravInsight. By accessing or using our platform, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our service.</p>

                <h3>2. Description of Service</h3>
                <p>StravInsight provides analytics and insights based on your Strava data. We connect to your Strava account through their official API to analyze your training activities.</p>

                <h3>3. User Accounts</h3>
                <p>To use StravInsight, you must have a valid Strava account and authorize our application to access your data. You are responsible for maintaining the confidentiality of your account information.</p>

                <h3>4. Data Usage</h3>
                <p>We only access the Strava data that you explicitly authorize. For more information on how we handle your data, please refer to our Privacy Policy.</p>

                <h3>5. Prohibited Activities</h3>
                <p>Users agree not to misuse the service or help anyone else do so. Prohibited activities include attempting to access, tamper with, or use non-public areas of the platform.</p>

                <h3>6. Intellectual Property</h3>
                <p>All content, features, and functionality of StravInsight are owned by us and are protected by international copyright, trademark, and other intellectual property laws.</p>

                <h3>7. Termination</h3>
                <p>We reserve the right to suspend or terminate your access to StravInsight at any time for any reason without notice.</p>

                <h3>8. Disclaimer of Warranties</h3>
                <p>StravInsight is provided "as is" without any warranties, expressed or implied. We do not guarantee that the service will be error-free or uninterrupted.</p>

                <h3>9. Limitation of Liability</h3>
                <p>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.</p>

                <h3>10. Changes to Terms</h3>
                <p>We may modify these Terms at any time. Continued use of the service after changes constitutes acceptance of the new Terms.</p>

                <h3>11. Governing Law</h3>
                <p>These Terms shall be governed by the laws of the jurisdiction in which we operate, without regard to its conflict of law provisions.</p>

                <h3>12. Contact</h3>
                <p>If you have any questions about these Terms, please contact us at support@stravinsight.com.</p>
            ',
        ]);
    }

    #[Route('/privacy-policy', name: 'app_privacy_policy')]
    public function privacyPolicy(): Response
    {
        return $this->render('legal/index.html.twig', [
            'title' => 'Privacy Policy',
            'text' => '
                <h2>Privacy Policy for StravInsight</h2>
                <p>Last Updated: '.date('F d, Y').'</p>

                <h3>1. Introduction</h3>
                <p>At StravInsight, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.</p>

                <h3>2. Information We Collect</h3>
                <p>When you connect your Strava account to StravInsight, we collect:</p>
                <ul>
                    <li>Basic profile information (name, email, profile picture)</li>
                    <li>Activity data (routes, distances, times, heart rate, power data, etc.)</li>
                    <li>Device and technical information</li>
                </ul>

                <h3>3. How We Use Your Information</h3>
                <p>We use your data to:</p>
                <ul>
                    <li>Provide analytics and insights about your training</li>
                    <li>Improve and personalize our services</li>
                    <li>Communicate with you about your account or our platform</li>
                    <li>Ensure the security and proper functioning of our platform</li>
                </ul>

                <h3>4. Data Sharing and Disclosure</h3>
                <p>We do not sell your personal information. We may share your data with:</p>
                <ul>
                    <li>Service providers who help us operate our platform</li>
                    <li>Legal authorities when required by law</li>
                    <li>Other parties with your explicit consent</li>
                </ul>

                <h3>5. Data Security</h3>
                <p>We implement appropriate security measures to protect your personal information. All data is encrypted both in transit and at rest.</p>

                <h3>6. Your Data Rights</h3>
                <p>Depending on your location, you may have the right to:</p>
                <ul>
                    <li>Access your personal data</li>
                    <li>Correct inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Object to our processing of your data</li>
                    <li>Data portability</li>
                </ul>

                <h3>7. Data Retention</h3>
                <p>We retain your data for as long as your account is active or as needed to provide you services. You can request deletion of your account and associated data at any time.</p>

                <h3>8. Cookies and Tracking</h3>
                <p>We use cookies and similar technologies to enhance your experience, analyze usage, and improve the effectiveness of our platform.</p>

                <h3>9. Children\'s Privacy</h3>
                <p>Our services are not directed to children under 16. We do not knowingly collect personal information from children under 16.</p>

                <h3>10. Changes to This Policy</h3>
                <p>We may update our Privacy Policy occasionally. We will notify you of any changes by posting the new policy on this page.</p>

                <h3>11. Contact Us</h3>
                <p>If you have questions about this Privacy Policy, please contact us at privacy@stravinsight.com.</p>
            ',
        ]);
    }

    #[Route('/legal-notice', name: 'app_legal_notice')]
    public function legalNotice(): Response
    {
        return $this->render('legal/index.html.twig', [
            'title' => 'Legal Notice',
            'text' => '
                <h2>Legal Notice</h2>
                <p>Last Updated: '.date('F d, Y').'</p>

                <h3>Company Information</h3>
                <p>StravInsight is operated by:</p>
                <p>
                    StravInsight Inc.<br>
                    123 Analytics Street<br>
                    Tech City, TC 12345<br>
                    United States
                </p>
                <p>
                    Email: contact@stravinsight.com<br>
                    Phone: +1 (555) 123-4567
                </p>

                <h3>Registration Information</h3>
                <p>
                    Business Registration Number: 12345678<br>
                    Tax Identification Number: US-987654321
                </p>

                <h3>Legal Representatives</h3>
                <p>John Smith, Chief Executive Officer</p>

                <h3>Hosting Information</h3>
                <p>The StravInsight platform is hosted by:</p>
                <p>
                    Cloud Hosting Provider Inc.<br>
                    456 Server Road<br>
                    Data Center City, DC 67890<br>
                    United States
                </p>

                <h3>Intellectual Property</h3>
                <p>The StravInsight name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of StravInsight Inc. or its affiliates. All other names, logos, product and service names, designs, and slogans on this website are the trademarks of their respective owners.</p>

                <h3>Dispute Resolution</h3>
                <p>Any disputes arising out of or related to the use of StravInsight shall be governed by the laws of the United States and the State of California, without regard to its conflict of law provisions.</p>

                <h3>Limitation of Liability</h3>
                <p>To the maximum extent permitted by applicable law, StravInsight and its suppliers shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.</p>
            ',
        ]);
    }
}
