import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { GraduationCap, MapPin, Phone, DollarSign, BookOpen } from 'lucide-react';

interface MoroccanStudentFormProps {
  studentData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export const MoroccanStudentForm: React.FC<MoroccanStudentFormProps> = ({
  studentData,
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    // Basic info
    name: studentData?.name || '',
    email: studentData?.email || '',
    
    // 🇲🇦 Moroccan National Student Profile
    massarId: studentData?.massarId || '',
    cne: studentData?.cne || '',
    apogee: studentData?.apogee || '',
    arabicName: studentData?.arabicName || '',
    latinName: studentData?.latinName || '',
    cin: studentData?.cin || '',
    cinIssuePlace: studentData?.cinIssuePlace || '',
    cinIssueDate: studentData?.cinIssueDate || '',
    wilaya: studentData?.wilaya || '',
    province: studentData?.province || '',
    communeOfBirth: studentData?.communeOfBirth || '',
    academicCycle: studentData?.academicCycle || 'Primary',
    track: studentData?.track || '',
    boursier: studentData?.boursier || false,
    scholarshipAmount: studentData?.scholarshipAmount || '',
    redoublement: studentData?.redoublement || false,
    repeatCount: studentData?.repeatCount || 0,
    
    // 📞 Guardian Information
    guardianNameArabic: studentData?.guardianNameArabic || '',
    guardianRelationship: studentData?.guardianRelationship || 'أب',
    guardianPhone: studentData?.guardianPhone || '',
    
    // 📆 Conduct & Discipline
    noteConduite: studentData?.noteConduite || '',
    
    // 🏛 Fees Management
    feesInsurance: studentData?.feesInsurance || '',
    feesCooperative: studentData?.feesCooperative || '',
    feesCanteen: studentData?.feesCanteen || '',
    feesStatus: studentData?.feesStatus || 'pending'
  });

  const moroccanWilayas = [
    'Casablanca-Settat', 'Rabat-Salé-Kénitra', 'Marrakech-Safi', 'Fès-Meknès',
    'Tanger-Tétouan-Al Hoceïma', 'Souss-Massa', 'Oriental', 'Drâa-Tafilalet',
    'Béni Mellal-Khénifra', 'Laâyoune-Sakia El Hamra', 'Dakhla-Oued Ed-Dahab',
    'Guelmim-Oued Noun'
  ];

  const academicTracks = {
    'Primary': ['Général'],
    'Collège': ['Tronc Commun'],
    'Lycée': ['Sciences Mathématiques', 'Sciences Physiques', 'Sciences de la Vie et de la Terre', 
              'Sciences Économiques et Gestion', 'Lettres et Sciences Humaines', 'Arts Appliqués']
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      role: 'student',
      boursier: Boolean(formData.boursier),
      redoublement: Boolean(formData.redoublement)
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500 py-8">
      <Card className="w-full max-w-4xl mx-auto rounded-3xl shadow-2xl bg-white/90 dark:bg-gray-900/90 p-2 md:p-8 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-extrabold">
            <GraduationCap className="h-7 w-7 text-primary" />
            {isEditing ? 'تعديل ملف الطالب - Modifier le Profil Étudiant' : 'إضافة طالب جديد - Nouveau Profil Étudiant'}
          </CardTitle>
          <CardDescription className="text-base">
            {isEditing ? 'Update Moroccan student profile information' : 'Complete Moroccan student profile registration'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-4 rounded-2xl bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 mb-6">
                <TabsTrigger value="personal" className="rounded-xl flex items-center gap-2 text-base font-semibold"><GraduationCap className="h-5 w-5" /> Personal</TabsTrigger>
                <TabsTrigger value="academic" className="rounded-xl flex items-center gap-2 text-base font-semibold"><BookOpen className="h-5 w-5" /> Academic</TabsTrigger>
                <TabsTrigger value="guardian" className="rounded-xl flex items-center gap-2 text-base font-semibold"><Phone className="h-5 w-5" /> Guardian</TabsTrigger>
                <TabsTrigger value="fees" className="rounded-xl flex items-center gap-2 text-base font-semibold"><DollarSign className="h-5 w-5" /> Fees</TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-blue-700 dark:text-blue-300 font-semibold">Full Name (English)</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="John Doe"
                      required
                      className="rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="arabicName" className="text-blue-700 dark:text-blue-300 font-semibold">الاسم الكامل (بالعربية)</Label>
                    <Input
                      id="arabicName"
                      value={formData.arabicName}
                      onChange={(e) => setFormData({...formData, arabicName: e.target.value})}
                      placeholder="محمد بن عبد الله"
                      className="text-right rounded-lg px-4 py-2"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-blue-700 dark:text-blue-300 font-semibold">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="student@school.ma"
                      required
                      className="rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="massarId" className="text-blue-700 dark:text-blue-300 font-semibold">
                      MASSAR ID <Badge variant="secondary">10 digits</Badge>
                    </Label>
                    <Input
                      id="massarId"
                      value={formData.massarId}
                      onChange={(e) => setFormData({...formData, massarId: e.target.value})}
                      placeholder="ST20241001"
                      maxLength={10}
                      required
                      className="rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cne" className="text-blue-700 dark:text-blue-300 font-semibold">CNE (Code National Étudiant)</Label>
                    <Input
                      id="cne"
                      value={formData.cne}
                      onChange={(e) => setFormData({...formData, cne: e.target.value})}
                      placeholder="R148523697"
                      className="rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cin" className="text-blue-700 dark:text-blue-300 font-semibold">CIN (بطاقة التعريف الوطنية)</Label>
                    <Input
                      id="cin"
                      value={formData.cin}
                      onChange={(e) => setFormData({...formData, cin: e.target.value})}
                      placeholder="AB123456"
                      className="rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="wilaya" className="text-blue-700 dark:text-blue-300 font-semibold">Wilaya/Province</Label>
                    <Select value={formData.wilaya} onValueChange={(value) => setFormData({...formData, wilaya: value})}>
                      <SelectTrigger className="rounded-lg px-4 py-2">
                        <SelectValue placeholder="Select Wilaya" />
                      </SelectTrigger>
                      <SelectContent>
                        {moroccanWilayas.map((wilaya) => (
                          <SelectItem key={wilaya} value={wilaya}>{wilaya}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="communeOfBirth" className="text-blue-700 dark:text-blue-300 font-semibold">Commune of Birth</Label>
                    <Input
                      id="communeOfBirth"
                      value={formData.communeOfBirth}
                      onChange={(e) => setFormData({...formData, communeOfBirth: e.target.value})}
                      placeholder="Casablanca"
                      className="rounded-lg px-4 py-2"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Academic Information Tab */}
              <TabsContent value="academic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="academicCycle">Academic Cycle</Label>
                    <Select 
                      value={formData.academicCycle} 
                      onValueChange={(value) => setFormData({...formData, academicCycle: value, track: ''})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Cycle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Primary">Primary (الابتدائي)</SelectItem>
                        <SelectItem value="Collège">Collège (الإعدادي)</SelectItem>
                        <SelectItem value="Lycée">Lycée (الثانوي)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="track">Academic Track</Label>
                    <Select 
                      value={formData.track} 
                      onValueChange={(value) => setFormData({...formData, track: value})}
                      disabled={!formData.academicCycle}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Track" />
                      </SelectTrigger>
                      <SelectContent>
                        {academicTracks[formData.academicCycle as keyof typeof academicTracks]?.map((track) => (
                          <SelectItem key={track} value={track}>{track}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="boursier"
                      checked={formData.boursier}
                      onCheckedChange={(checked) => setFormData({...formData, boursier: Boolean(checked)})}
                    />
                    <Label htmlFor="boursier">Scholarship Recipient (حاصل على منحة)</Label>
                  </div>

                  {formData.boursier && (
                    <div>
                      <Label htmlFor="scholarshipAmount">Scholarship Amount (MAD)</Label>
                      <Input
                        id="scholarshipAmount"
                        type="number"
                        value={formData.scholarshipAmount}
                        onChange={(e) => setFormData({...formData, scholarshipAmount: e.target.value})}
                        placeholder="2500.00"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="redoublement"
                      checked={formData.redoublement}
                      onCheckedChange={(checked) => setFormData({...formData, redoublement: Boolean(checked)})}
                    />
                    <Label htmlFor="redoublement">Has Repeated a Year (إعادة السنة)</Label>
                  </div>

                  <div>
                    <Label htmlFor="noteConduite">Conduct Grade (0-20)</Label>
                    <Input
                      id="noteConduite"
                      type="number"
                      min="0"
                      max="20"
                      step="0.1"
                      value={formData.noteConduite}
                      onChange={(e) => setFormData({...formData, noteConduite: e.target.value})}
                      placeholder="18.5"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Guardian Information Tab */}
              <TabsContent value="guardian" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guardianNameArabic">Guardian Name (Arabic)</Label>
                    <Input
                      id="guardianNameArabic"
                      value={formData.guardianNameArabic}
                      onChange={(e) => setFormData({...formData, guardianNameArabic: e.target.value})}
                      placeholder="أحمد بن محمد"
                      className="text-right"
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="guardianRelationship">Relationship</Label>
                    <Select 
                      value={formData.guardianRelationship} 
                      onValueChange={(value) => setFormData({...formData, guardianRelationship: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="أب">أب (Father)</SelectItem>
                        <SelectItem value="أم">أم (Mother)</SelectItem>
                        <SelectItem value="ولي أمر">ولي أمر (Guardian)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="guardianPhone">Guardian Phone</Label>
                    <Input
                      id="guardianPhone"
                      value={formData.guardianPhone}
                      onChange={(e) => setFormData({...formData, guardianPhone: e.target.value})}
                      placeholder="+212661234567"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Fees Management Tab */}
              <TabsContent value="fees" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="feesInsurance">Insurance Fees (MAD)</Label>
                    <Input
                      id="feesInsurance"
                      type="number"
                      value={formData.feesInsurance}
                      onChange={(e) => setFormData({...formData, feesInsurance: e.target.value})}
                      placeholder="200.00"
                    />
                  </div>

                  <div>
                    <Label htmlFor="feesCooperative">Cooperative Fees (MAD)</Label>
                    <Input
                      id="feesCooperative"
                      type="number"
                      value={formData.feesCooperative}
                      onChange={(e) => setFormData({...formData, feesCooperative: e.target.value})}
                      placeholder="150.00"
                    />
                  </div>

                  <div>
                    <Label htmlFor="feesCanteen">Canteen Fees (MAD)</Label>
                    <Input
                      id="feesCanteen"
                      type="number"
                      value={formData.feesCanteen}
                      onChange={(e) => setFormData({...formData, feesCanteen: e.target.value})}
                      placeholder="800.00"
                    />
                  </div>

                  <div>
                    <Label htmlFor="feesStatus">Payment Status</Label>
                    <Select 
                      value={formData.feesStatus} 
                      onValueChange={(value) => setFormData({...formData, feesStatus: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Paid (مدفوع)</SelectItem>
                        <SelectItem value="pending">Pending (في الانتظار)</SelectItem>
                        <SelectItem value="overdue">Overdue (متأخر)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex justify-end gap-4 mt-8">
              <Button type="button" variant="outline" onClick={onCancel} className="rounded-full px-6 py-2 shadow hover:scale-105 transition-transform">Cancel</Button>
              <Button type="submit" className="rounded-full px-6 py-2 shadow-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2 transition-transform">
                {isEditing ? 'Save' : 'Create Student'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};